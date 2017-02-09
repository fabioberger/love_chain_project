const _ = require('lodash');
const React = require('react');
const Link = require('react-router').Link
const RaisedButton = require('material-ui').RaisedButton;
const Paper = require('material-ui').Paper;
const BlockchainState = require('../../blockchain_state');
const RequestFeed = require('../sub_components/request_feed');
const NewRequestDialog = require('../sub_components/new_request_dialog');
const AcceptRequestDialog = require('../sub_components/accept_request_dialog');
const Loading = require('../sub_components/loading');
const Error = require('../sub_components/error');

const Home = React.createClass({
    propTypes: {
        blockchainState: React.PropTypes.instanceOf(BlockchainState),
    },
    getInitialState() {
        return {
            isNewRequestDialogOpen: false,
            isAcceptRequestDialogOpen: false,
        };
    },
    componentDidMount() {
        window.scrollTo(0, 0);
    },
    render() {
        const style = {
            height: 800,
            width: '100%',
            textAlign: 'center',
            display: 'inline-block',
        };

        return (
            <Paper style={style} zDepth={3}>
                {!this.props.blockchainState.isLoaded() ?
                    <div className="pt4">
                        <Loading message="Connecting to the blockchain..." />
                    </div> :
                    this._renderValentineFeed()
                }
            </Paper>
        );
    },
    _newRequestDialogToggle(isOpen) {
        this.setState({
            isNewRequestDialogOpen: isOpen,
        });
    },
    _acceptRequestDialogToggle(isOpen) {
        this.setState({
            isAcceptRequestDialogOpen: isOpen,
        });
    },
    _renderValentineFeed() {
        const hasBlockchainErr = this.props.blockchainState.hasError();

        return (
            <div>
                <div className="pl2 pr2 pt3 clearfix" style={{height: '37px'}}>
                <RaisedButton
                    label="Accept Valentine Request"
                    className="right"
                    disabled={hasBlockchainErr}
                    onTouchTap={() => this._acceptRequestDialogToggle(true)} />
                    <RaisedButton
                        label="Send Valentine Request"
                        className="mr2 right"
                        disabled={hasBlockchainErr}
                        onTouchTap={() => this._newRequestDialogToggle(true)} />
                </div>
                <div className="m3" style={{backgroundColor: "#FFCDD2", height: "450px"}}>
                    {hasBlockchainErr ?
                        <Error type={this.props.blockchainState.getError()} /> :
                        <RequestFeed
                            blockchainState={this.props.blockchainState} />
                    }
                </div>
                {!hasBlockchainErr &&
                    <div>
                        <NewRequestDialog
                            isOpen={this.state.isNewRequestDialogOpen}
                            blockchainState={this.props.blockchainState}
                            toggleDialogFn={this._newRequestDialogToggle} />
                        <AcceptRequestDialog
                            isOpen={this.state.isAcceptRequestDialogOpen}
                            blockchainState={this.props.blockchainState}
                            toggleDialogFn={this._acceptRequestDialogToggle} />
                    </div>
                }

            </div>
        );
    },
});

module.exports = Home;
