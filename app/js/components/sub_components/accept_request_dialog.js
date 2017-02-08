const React = require('react');
const Dialog = require('material-ui').Dialog;
const FlatButton = require('material-ui').FlatButton;
const TextField = require('material-ui').TextField;
const BlockchainState = require('../../blockchain_state');
const RequiredLabelText = require('./required_label_text');

const AcceptRequestDialog = React.createClass({
    propTypes: {
        isOpen: React.PropTypes.bool.isRequired,
        blockchainState: React.PropTypes.instanceOf(BlockchainState).isRequired,
        toggleDialogFn: React.PropTypes.func.isRequired,
    },
    getInitialState() {
        return {
            acceptRequestFormErrMsgs: {
                general: '',
                ...this._getEmptyAcceptRequestObj(),
            },
            form: this._getEmptyAcceptRequestObj(),
        };
    },
    render() {
        const dialogActions = [
            <FlatButton
                label="Accept"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this._onAcceptRequestClickAsync} />,
        ];

        return (
            <Dialog
                title="Accept valentine request"
                actions={dialogActions}
                open={this.props.isOpen}
                contentStyle={{width: '400px'}}
                onRequestClose={() => this.props.toggleDialogFn(false)} >
                <TextField
                    floatingLabelText={<RequiredLabelText label="Requester's ethereum address" />}
                    errorText={this.state.acceptRequestFormErrMsgs.requesterAddress}
                    value={this.state.form.requesterAddress}
                    onChange={e => this._onUpdateForm('requesterAddress', e.target.value)}
                    onKeyUp={this._onKeyUp} />
                <div className="pt2">{this.state.acceptRequestFormErrMsgs.general}</div>
            </Dialog>
        );
    },
    _getEmptyAcceptRequestObj() {
        return {
            requesterAddress: '',
        };
    },
    async _onAcceptRequestClickAsync() {
        const acceptRequestFormErrMsgs = {
            general: '',
            requesterAddress: '',
        };
        const requesterAddress = this.state.form.requesterAddress;

        if (requesterAddress === '') {
            acceptRequestFormErrMsgs.requesterAddress = `requesterAddress is required`;
        } else if (!this.props.blockchainState.isValidAddress(requesterAddress)) {
            acceptRequestFormErrMsgs.requesterAddress = 'Must be a valid hex encoded ethereum address e.g 0xccd51...';
        } else {
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
        if (hasErrors) {
            this.setState({
                acceptRequestFormErrMsgs,
            });
        } else {
            this.props.blockchainState.acceptValentineRequestAsync(requesterAddress);
            this.props.toggleDialogFn(false);
            this.setState({
                form: this._getEmptyAcceptRequestObj(),
            });
        }
    },
    _onKeyUp(e) {
        if (e.key === 'Enter') {
            this._onAcceptRequestClickAsync();
        }
    },
    _onUpdateForm(key, value) {
        const form = this.state.form;
        form[key] = value;
        this.setState({
            form,
        });
    },
});

module.exports = AcceptRequestDialog;
