import _ from 'lodash';
import React from 'react';
import {RaisedButton, Paper} from 'material-ui';
import BlockchainState from 'js/blockchain_state';
import RequestFeed from 'js/components/sub_components/request_feed';
import NewRequestDialog from 'js/components/sub_components/new_request_dialog';
import AcceptRequestDialog from 'js/components/sub_components/accept_request_dialog';
import Loading from 'js/components/sub_components/loading';
import Error from 'js/components/sub_components/error';

class Home extends React.Component {
    static propTypes = {
        blockchainState: React.PropTypes.instanceOf(BlockchainState),
    }
    constructor(props) {
        super(props);
        this.state = {
            isNewRequestDialogOpen: false,
            isAcceptRequestDialogOpen: false,
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        const style = {
            height: 800,
            width: '100%',
            textAlign: 'center',
            display: 'inline-block',
        };

        const isLoaded = this.props.blockchainState.isLoaded();
        const hasBlockchainErr = this.props.blockchainState.hasError();
        return (
            <Paper style={style} zDepth={3}>
                <div className="pl2 pr2 pt3 clearfix">
                    <div className="inline-block hostedBadge">
                        <div>
                            <img style={{width: '50px'}} src="imgs/ethereum_icon.png" />
                        </div>
                        <div className="h5">Hosted on Ethereum</div>
                    </div>
                    <RaisedButton
                        label="Send Valentine Request"
                        className="ml2 left acceptButton"
                        disabled={!isLoaded || hasBlockchainErr}
                        onTouchTap={() => this._newRequestDialogToggle(true)} />
                    <RaisedButton
                        label="Accept Valentine Request"
                        className="mr2 right sendButton"
                        disabled={!isLoaded || hasBlockchainErr}
                        onTouchTap={() => this._acceptRequestDialogToggle(true)} />
                </div>
                <div className="mx3 p3 mt3 mb3 overflow-scroll relative" style={{backgroundColor: "#FFCDD2", height: "530px"}}>
                    {!isLoaded ?
                        <Loading message="Connecting to the blockchain..." /> :
                        this._renderValentineFeed(hasBlockchainErr)
                    }
                </div>
                {(isLoaded && !hasBlockchainErr) &&
                    <div>
                        <NewRequestDialog
                            isOpen={this.state.isNewRequestDialogOpen}
                            blockchainState={this.props.blockchainState}
                            toggleDialogFn={this._newRequestDialogToggle.bind(this)} />
                        <AcceptRequestDialog
                            isOpen={this.state.isAcceptRequestDialogOpen}
                            blockchainState={this.props.blockchainState}
                            toggleDialogFn={this._acceptRequestDialogToggle.bind(this)} />
                    </div>
                }
            </Paper>
        );
    }
    _newRequestDialogToggle(isOpen) {
        this.setState({
            isNewRequestDialogOpen: isOpen,
        });
    }
    _acceptRequestDialogToggle(isOpen) {
        this.setState({
            isAcceptRequestDialogOpen: isOpen,
        });
    }
    _renderValentineFeed(hasBlockchainErr) {
        return (
            <div>
                {hasBlockchainErr ?
                    <Error type={this.props.blockchainState.getError()} /> :
                    <RequestFeed blockchainState={this.props.blockchainState} />
                }
            </div>
        );
    }
}

export default Home;
