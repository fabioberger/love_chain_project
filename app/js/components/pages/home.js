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
                <div className="m3 overflow-scroll" style={{backgroundColor: "#FFCDD2", height: "450px"}}>
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
    }
}

export default Home;
