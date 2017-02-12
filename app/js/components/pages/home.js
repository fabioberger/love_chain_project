import _ from 'lodash';
import React from 'react';
import {RaisedButton, Paper} from 'material-ui';
import BlockchainState from 'js/blockchain_state';
import RequestFeed from 'js/components/sub_components/request_feed';
import NewRequestDialog from 'js/components/sub_components/new_request_dialog';
import AcceptRequestDialog from 'js/components/sub_components/accept_request_dialog';
import PublicNodeNoticeDialog from 'js/components/sub_components/public_node_notice_dialog';
import Loading from 'js/components/sub_components/loading';
import Error from 'js/components/sub_components/error';
import ProviderMenu from 'js/components/sub_components/provider_menu';

class Home extends React.Component {
    static propTypes = {
        blockchainState: React.PropTypes.instanceOf(BlockchainState),
    }
    constructor(props) {
        super(props);
        this.state = {
            isNewRequestDialogOpen: false,
            isAcceptRequestDialogOpen: false,
            isPublicNodeNoticeDialogOpen: false,
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        const style = {
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            display: 'inline-block',
        };

        const isLoaded = this.props.blockchainState.isLoaded();
        const hasBlockchainErr = this.props.blockchainState.hasError();
        return (
            <Paper style={style} zDepth={3}>
                <div className="pl2 pr2 pt3 clearfix">
                    <div className="hostedBadge">
                        <div>
                            <img style={{width: '50px'}} src="imgs/ethereum_icon.png" />
                        </div>
                        <div className="h5">Hosted on Ethereum</div>
                    </div>
                    <div className="ml2 actionButtons">
                        <div className="pb2">
                            <RaisedButton
                                style={{width: 225}}
                                label="Send Valentine Request"
                                className="acceptButton"
                                disabled={!isLoaded || hasBlockchainErr}
                                onTouchTap={() => this._onSendValentineRequestClick()} />
                        </div>
                        <div>
                            <RaisedButton
                                label="Accept Valentine Request"
                                className="sendButton"
                                disabled={!isLoaded || hasBlockchainErr}
                                onTouchTap={() => this._onAcceptValentineRequestClick()} />
                        </div>
                    </div>
                    <div className="networkMenu" style={{width: 263, height: 56}}>
                        {isLoaded &&
                            <ProviderMenu
                                blockchainState={this.props.blockchainState} />
                        }
                    </div>
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
                        <PublicNodeNoticeDialog
                            isOpen={this.state.isPublicNodeNoticeDialogOpen}
                            toggleDialogFn={isOpen => this._publicNodeNoticeDialogToggle(isOpen)} />
                    </div>
                }
            </Paper>
        );
    }
    _onSendValentineRequestClick() {
        if (this.props.blockchainState.canSendTransactions()) {
            this._newRequestDialogToggle(true);
        } else {
            this._publicNodeNoticeDialogToggle(true);
        }
    }
    _onAcceptValentineRequestClick() {
        if (this.props.blockchainState.canSendTransactions()) {
            this._acceptRequestDialogToggle(true);
        } else {
            this._publicNodeNoticeDialogToggle(true);
        }
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
    _publicNodeNoticeDialogToggle(isOpen) {
        this.setState({
            isPublicNodeNoticeDialogOpen: isOpen,
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
