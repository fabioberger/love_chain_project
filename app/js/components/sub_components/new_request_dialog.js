import React from 'react';
import {Dialog, FlatButton, TextField} from 'material-ui';
import BlockchainState from 'js/blockchain_state';
import RequiredLabelText from 'js/components/sub_components/required_label_text';

const NewRequestDialog = React.createClass({
    propTypes: {
        isOpen: React.PropTypes.bool.isRequired,
        blockchainState: React.PropTypes.instanceOf(BlockchainState).isRequired,
        toggleDialogFn: React.PropTypes.func.isRequired,
    },
    getInitialState() {
        return {
            request: this._getEmptyRequestFormMap(),
            requestFormErrMsgs: {
                general: '',
                ...this._getEmptyRequestFormMap(),
            },
        };
    },
    render() {
        const dialogActions = [
            <FlatButton
                label="Create"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this._onRequestSubmitClickAsync} />,
        ];

        return (
            <Dialog
                title="Create valentine request"
                actions={dialogActions}
                open={this.props.isOpen}
                contentStyle={{width: '400px'}}
                onRequestClose={() => this.props.toggleDialogFn(false)}
                autoScrollBodyContent={true} >
                <TextField
                floatingLabelText={<RequiredLabelText label="Your name" />}
                errorText={this.state.requestFormErrMsgs.requesterName}
                value={this.state.request.requesterName}
                onChange={e => this._onUpdateRequest('requesterName', e.target.value)} />
                <br />
                <TextField
                    floatingLabelText={<RequiredLabelText label="Your valentine's name" />}
                    errorText={this.state.requestFormErrMsgs.valentineName}
                    value={this.state.request.valentineName}
                    onChange={e => this._onUpdateRequest('valentineName', e.target.value)} />
                <br />
                <TextField
                    floatingLabelText={<RequiredLabelText label="Custom message" />}
                    multiLine={true}
                    rows={2}
                    rowsMax={4}
                    errorText={this.state.requestFormErrMsgs.customMessage}
                    value={this.state.request.customMessage}
                    onChange={e => this._onUpdateRequest('customMessage', e.target.value)} />
                <br />
                <TextField
                    floatingLabelText="Your valentine's ethereum address"
                    errorText={this.state.requestFormErrMsgs.valentineAddress}
                    value={this.state.request.valentineAddress}
                    onChange={e => this._onUpdateRequest('valentineAddress', e.target.value)}
                    onKeyUp={this._onKeyUp} />
                <div className="pt2">{this.state.requestFormErrMsgs.general}</div>
            </Dialog>
        );
    },
    _getEmptyRequestFormMap() {
        return {
            requesterName: '',
            valentineName: '',
            customMessage: '',
            valentineAddress: '',
        };
    },
    async _onRequestSubmitClickAsync() {
        const requestFormErrMsgs = this._getEmptyRequestFormMap();
        requestFormErrMsgs.general = '';
        const r = this.state.request;

        const requiredFields = ['requesterName', 'valentineName', 'customMessage'];
        _.each(requiredFields, requiredField => {
            if (r[requiredField] === '') {
                requestFormErrMsgs[requiredField] = `${requiredField} is required`;
            }
        });

        const MAX_CUSTOM_MESSAGE_LENGTH = 140;
        if (r.customMessage.length > MAX_CUSTOM_MESSAGE_LENGTH) {
            requestFormErrMsgs.customMessage = `Cannot exceeded ${MAX_CUSTOM_MESSAGE_LENGTH} characters`;
        }

        const MAX_NAME_LENGTH = 25;
        if (r.requesterName.length > MAX_NAME_LENGTH) {
            requestFormErrMsgs.requesterName = `Cannot exceeded ${MAX_NAME_LENGTH} characters`;
        }
        if (r.valentineName.length > MAX_NAME_LENGTH) {
            requestFormErrMsgs.valentineName = `Cannot exceeded ${MAX_NAME_LENGTH} characters`;
        }

        if (r.valentineAddress !== '' &&
            !this.props.blockchainState.isValidAddress(r.valentineAddress)) {
            requestFormErrMsgs.valentineAddress = 'Must be a valid hex encoded ethereum address e.g 0xccd51...';
        }

        const senderAddress = this.props.blockchainState.getFirstAccountIfExists();
        const isSenderAddressAvailable = !_.isNull(senderAddress);
        if (!isSenderAddressAvailable) {
            requestFormErrMsgs.general = 'Your ethereum address was not found. web3.eth.accounts \
            did not return any account addresses. If using Metamask, re-select an account and try \
            again.';
        } else {
            const doesExistingRequestExist = await this.props.blockchainState.didRequesterAlreadyRequestAsync();
            if (doesExistingRequestExist) {
                requestFormErrMsgs.general = 'You can only send one valentine request per account.';
            }
        }

        let hasErrors = false;
        _.each(requestFormErrMsgs, (value, key) => {
            if (value !== '') {
                hasErrors = true;
            }
        });

        if (hasErrors) {
            this.setState({
                requestFormErrMsgs,
            });
        } else {
            this.props.blockchainState.createValentineRequestFireAndForgetAsync(r.requesterName, r.valentineName, r.customMessage, r.valentineAddress);
            this.props.toggleDialogFn(false);
            this.setState({
                request: this._getEmptyRequestFormMap(),
            });
        }
    },
    _onKeyUp(e) {
        if (e.key === 'Enter') {
            this._onRequestSubmitClickAsync();
        }
    },
    _onUpdateRequest(key, value) {
        const request = this.state.request;
        request[key] = value;
        this.setState({
            request,
        });
    },
});

export default NewRequestDialog;
