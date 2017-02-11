import _ from 'lodash';
import React from 'react';
import {Dialog, FlatButton, TextField} from 'material-ui';
import constants from 'js/utils/constants';
import BlockchainState from 'js/blockchain_state';
import HelpTooltip from 'js/components/sub_components/help_tooltip';
import RequiredLabelText from 'js/components/sub_components/required_label_text';
import validator from 'js/schemas/validator';

class NewRequestDialog extends React.Component {
    static propTypes = {
        isOpen: React.PropTypes.bool.isRequired,
        blockchainState: React.PropTypes.instanceOf(BlockchainState).isRequired,
        toggleDialogFn: React.PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            request: this._getEmptyRequestFormMap(),
            requestFormErrMsgs: {
                general: '',
                ...this._getEmptyRequestFormMap(),
            },
            isLoading: false,
        };
    }
    render() {
        const dialogActions = [
            <FlatButton
                label={this.state.isLoading ? 'Sending...' : 'Create'}
                primary={true}
                keyboardFocused={true}
                disabled={this.state.isLoading}
                onTouchTap={this._onRequestSubmitClickAsync.bind(this)} />,
        ];
        const valentineAddressExplanation = 'If you specify your valentine\'s address here, only \
            they will be able to accept your request. Otherwise, anyone can accept it.';

        return (
            <Dialog
                title="Create valentine request"
                actions={dialogActions}
                open={this.props.isOpen}
                contentStyle={{width: '400px'}}
                onRequestClose={() => this.props.toggleDialogFn(false)}
                autoScrollBodyContent={true} >
                <TextField
                    className="block"
                    floatingLabelText={<RequiredLabelText label="Your first name" />}
                    errorText={this.state.requestFormErrMsgs.requesterName}
                    value={this.state.request.requesterName}
                    onChange={e => this._onUpdateRequest('requesterName', e.target.value)} />
                <TextField
                    className="block mt1"
                    floatingLabelText={<RequiredLabelText label="Your valentine's first name" />}
                    errorText={this.state.requestFormErrMsgs.valentineName}
                    value={this.state.request.valentineName}
                    onChange={e => this._onUpdateRequest('valentineName', e.target.value)} />
                <TextField
                    className="block mt1"
                    floatingLabelText={<RequiredLabelText label="Custom message" />}
                    multiLine={true}
                    rows={2}
                    rowsMax={4}
                    errorText={this.state.requestFormErrMsgs.customMessage}
                    value={this.state.request.customMessage}
                    onChange={e => this._onUpdateRequest('customMessage', e.target.value)} />
                <div className="block mt1">
                    <TextField
                        floatingLabelText="Your valentine's ethereum address"
                        errorText={this.state.requestFormErrMsgs.valentineAddress}
                        value={this.state.request.valentineAddress}
                        onChange={e => this._onUpdateRequest('valentineAddress', e.target.value)}
                        onKeyUp={this._onKeyUp.bind(this)} />
                    {' '}
                    <HelpTooltip explanation={valentineAddressExplanation} />
                </div>
                <div className="pt2">{this.state.requestFormErrMsgs.general}</div>
            </Dialog>
        );
    }
    _getEmptyRequestFormMap() {
        return {
            requesterName: '',
            valentineName: '',
            customMessage: '',
            valentineAddress: '',
        };
    }
    async _onRequestSubmitClickAsync() {
        this.setState({
            isLoading: true,
        });

        const requestFormErrMsgs = this._getEmptyRequestFormMap();
        requestFormErrMsgs.general = '';
        const r = this.state.request;

        const completeRequest = Object.assign({}, r);
        if (_.isEmpty(completeRequest.valentineAddress)) {
            completeRequest.valentineAddress = constants.NULL_ADDRESS;
        }
        completeRequest.wasAccepted = false;
        completeRequest.requesterAddress = this.props.blockchainState.getFirstAccountIfExists();
        const validationErrs = validator.getValidationErrorsIfExists(completeRequest, 'request');

        if (!_.isNull(validationErrs)) {
            _.each(validationErrs.details, validationErr => {
                if (validationErr.path !== 'requesterAddress') {
                    const messageWithoutFieldName = validationErr.message.replace(/\".*\"/g,'');
                    requestFormErrMsgs[validationErr.path] = messageWithoutFieldName;
                } else {
                    requestFormErrMsgs.general = 'Your ethereum address was not found. web3.eth.accounts \
                    did not return any account addresses. If using Metamask, re-select an account and try \
                    again.';
                }
            });
        }

        if (r.valentineAddress !== '' &&
            !this.props.blockchainState.isValidAddress(r.valentineAddress)) {
            requestFormErrMsgs.valentineAddress = 'Must be a valid hex encoded ethereum address e.g 0xccd51...';
        }

        if (!_.isNull(completeRequest.requesterAddress)) {
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
                isLoading: false,
            });
        } else {
            this.props.blockchainState.createValentineRequestFireAndForgetAsync(completeRequest);
            this.props.toggleDialogFn(false);
            this.setState({
                request: this._getEmptyRequestFormMap(),
                isLoading: false,
            });
        }
    }
    _onKeyUp(e) {
        if (e.key === 'Enter') {
            this._onRequestSubmitClickAsync();
        }
    }
    _onUpdateRequest(key, value) {
        const request = this.state.request;
        request[key] = value;
        this.setState({
            request,
        });
    }
}

export default NewRequestDialog;
