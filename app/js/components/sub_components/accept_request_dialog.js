import _ from 'lodash';
import React from 'react';
import {Dialog, FlatButton, TextField} from 'material-ui';
import BlockchainState from 'js/blockchain_state';
import LoadingMini from 'js/components/sub_components/loading_mini';
import RequiredLabelText from 'js/components/sub_components/required_label_text';
import HelpTooltip from 'js/components/sub_components/help_tooltip';

class AcceptRequestDialog extends React.Component {
    static propTypes = {
        isOpen: React.PropTypes.bool.isRequired,
        blockchainState: React.PropTypes.instanceOf(BlockchainState).isRequired,
        toggleDialogFn: React.PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            acceptRequestFormErrMsgs: {
                general: '',
                ...this._getEmptyAcceptRequestObj(),
            },
            form: this._getEmptyAcceptRequestObj(),
            isLoading: false,
            isValidating: true,
        };
    }
    render() {
        let loadingSymbol = [];
        if (this.state.isLoading  && !this.state.isValidating) {
            loadingSymbol = [
                <div className="left pl2" style={{fontSize: '13px', paddingTop: 10}}>
                    <b>Note:</b> This can take a minute or two
                </div>,
                <LoadingMini className="inline-block" />,
            ];
        }
        const dialogActions = [
            ...loadingSymbol,
            <FlatButton
                label={(this.state.isLoading && !this.state.isValidating) ? 'Sending...' : 'Accept'}
                primary={true}
                disabled={this.state.isLoading}
                onTouchTap={this._onAcceptRequestClickAsync.bind(this)} />,
        ];

        const requesterAddressExplanation = 'Ethereum address belonging to the person who sent you the request. \
            You can copy-paste the address next to their name in the valentine request feed.';

        return (
            <Dialog
                title="Accept valentine request"
                actions={dialogActions}
                open={this.props.isOpen}
                modal={this.state.isLoading}
                contentStyle={{width: '400px'}}
                onRequestClose={() => this.props.toggleDialogFn(false)}
                autoScrollBodyContent={true} >
                <div className="block mt1" id="innerScrollDivMarker">
                    <TextField
                        floatingLabelText={<RequiredLabelText label="Requester's ethereum address" />}
                        errorText={this.state.acceptRequestFormErrMsgs.requesterAddress}
                        value={this.state.form.requesterAddress}
                        disabled={this.state.isLoading}
                        onChange={e => this._onUpdateForm('requesterAddress', e.target.value)}
                        onKeyUp={this._onKeyUp.bind(this)} />
                    {' '}
                    <HelpTooltip explanation={requesterAddressExplanation} />
                </div>
                <div className="pt2">{this.state.acceptRequestFormErrMsgs.general}</div>
            </Dialog>
        );
    }
    _getEmptyAcceptRequestObj() {
        return {
            requesterAddress: '',
        };
    }
    async _onAcceptRequestClickAsync() {
        this.setState({
            isLoading: true,
            isValidating: true,
        });

        const acceptRequestFormErrMsgs = {
            general: '',
            requesterAddress: '',
        };
        const requesterAddress = this.state.form.requesterAddress;

        const senderAddress = this.props.blockchainState.getFirstAccountIfExists();
        const isSenderAddressAvailable = !_.isNull(senderAddress);
        if (!isSenderAddressAvailable) {
            acceptRequestFormErrMsgs.general = 'Your ethereum address was not found. web3.eth.accounts \
            did not return any account addresses. If using Metamask, re-select an account and try \
            again.';
        }

        if (requesterAddress === '') {
            acceptRequestFormErrMsgs.requesterAddress = `requesterAddress is required`;
        } else if (!this.props.blockchainState.isValidAddress(requesterAddress)) {
            acceptRequestFormErrMsgs.requesterAddress = 'Must be a valid hex encoded ethereum address e.g 0xccd51...';
        } else if (isSenderAddressAvailable) {
            const request = await this.props.blockchainState.getRequestIfExistsAsync(requesterAddress);
            if (!request) {
                acceptRequestFormErrMsgs.general = 'There is no request associated with this address';
            } else if (request.wasAccepted) {
                acceptRequestFormErrMsgs.general = 'Someone already accepted this valentine request';
            } else if (!this.props.blockchainState.isRequestTargetedAtUser(request.valentineAddress)) {
                acceptRequestFormErrMsgs.general = `This request can only be accepted by: ${request.valentineAddress}`;
            }
        }

        const hasErrors = _.some(acceptRequestFormErrMsgs, (value, key) => value !== '');
        this.setState({
            acceptRequestFormErrMsgs,
            isValidating: false,
        });
        if (hasErrors) {
            this.setState({
                isLoading: false,
            });
            // Hack: Scroll to bottom
            const scrollDivElement = document.getElementById('innerScrollDivMarker').parentNode;
            scrollDivElement.scrollTop = scrollDivElement.scrollHeight;
        } else {
            await this.props.blockchainState.acceptValentineRequestAsync(requesterAddress);
            this.props.toggleDialogFn(false);
            this.setState({
                form: this._getEmptyAcceptRequestObj(),
                isLoading: false,
            });
        }
    }
    _onKeyUp(e) {
        if (e.key === 'Enter') {
            this._onAcceptRequestClickAsync();
        }
    }
    _onUpdateForm(key, value) {
        const form = this.state.form;
        form[key] = value;
        this.setState({
            form,
        });
    }
}

export default AcceptRequestDialog;
