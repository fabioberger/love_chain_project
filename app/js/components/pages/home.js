import _ from 'lodash';
import React from 'react';
import {RaisedButton, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import ReactTooltip from 'react-tooltip';
import BlockchainState from 'js/blockchain_state';
import configs from 'js/utils/configs';
import RequestFeed from 'js/components/sub_components/request_feed';
import NewRequestDialog from 'js/components/sub_components/new_request_dialog';
import AcceptRequestDialog from 'js/components/sub_components/accept_request_dialog';
import PublicNodeNoticeDialog from 'js/components/sub_components/public_node_notice_dialog';
import Loading from 'js/components/sub_components/loading';
import Error from 'js/components/sub_components/error';
import ProviderMenu from 'js/components/sub_components/provider_menu';
import OutLink from 'js/components/sub_components/out_link';
import CopyableAddress from 'js/components/sub_components/copyable_address';

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
                <div className="px2 pt3 clearfix">
                    <div className="hostedBadge">
                        <OutLink href={configs.ETHERSCAN_MAINNET_URL}>
                        <div>
                            <img style={{width: '50px'}} src="imgs/ethereum_icon.png" />
                        </div>
                        <div className="h5">Hosted on Ethereum</div>
                        </OutLink>
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
                <div className="mx3 mb4 left-align" style={{color: colors.grey700}}>
                    <h1 className="center">About</h1>
                    <div>
                        {`The Love Chain Project is bringing paper/sms based valentine requests onto the blockchain. Let's leverage
                          the awesome powers of immutability to give our valentine requests a lasting impression. Want to be
                          cryptographically certain your valentine request was accepted by no one but your true love? Ask them for
                          an Ethereum address they control, and add it to your request. They will then be the only person who
                          can accept your request!`}
                    </div>
                    <h3>What is Ethereum?</h3>
                    <div>
                        <OutLink href={configs.ETHEREUM_ORG_URL}>Ethereum</OutLink>{` is a blockchain technology
                            similar to Bitcoin that let's people build decentralized
                            applications (Dapps) with ease. Dapps (like this one!) allow individuals
                            to interact with one another over the blockchain without a trusted
                            third-party (i.e I cannot change or take down your valentine requests, so
                            be responsible!).`}
                    </div>
                    <h3 className="mt3">Look ma, no backend!</h3>
                    <div>
                        {`This app is "hosted on Ethereum". This means it is a front-end app
                        that runs entirely in your browser without a backing server. Instead it reads and
                        writes valentine requests directly to/from the blockchain via this `}
                        {<OutLink href={configs.ETHERSCAN_MAINNET_URL}>smart contract</OutLink>}.
                        {` If you wanted, you could download and install an Ethereum node onto your own
                         computer and use it with this Dapp!`}
                    </div>
                    <h3 className="mt3">Cause</h3>
                    <div>
                        {`Sending a valentine request to your loved ones will cost a small donation (`}
                        <span className="bold" data-tip data-for="donationTooltip">0.1 ETH</span>
                        {`) and
                        some gas (`}
                        <span className="bold" data-tip data-for="gasTooltip">~0.003 ETH</span>
                        {`) to send it into the network. All the proceeds from this project
                        are going towards teaching refugees in Germany how to code. Many have fled their
                        homeland in hopes of a brighter future and are hungry to learn new skills and start
                        contributing to society. Let's help them do that.`}
                        <ReactTooltip id="donationTooltip">Worth about €1.05 at time of writing</ReactTooltip>
                        <ReactTooltip id="gasTooltip">Worth about €0.03 at time of writing</ReactTooltip>
                    </div>
                    <div className="pt2">
                        Any additional donations can be sent directly to:{' '}
                        <CopyableAddress address="0x4757e41730892E288aC2B09bE5882D422a8DfEb5" />
                    </div>
                    <h3>Need help</h3>
                    <div>
                        Need help sending or accepting valentine requests? Found a bug? Contact us on{' '}
                        <OutLink href="https://gitter.im/love_chain_project/Lobby#">Gitter</OutLink>.
                    </div>
                    <h3 className="mt3">Special thanks</h3>
                    <div>
                        Special thanks to these incredible projects and the people behind them!
                    </div>
                    <ul>
                        <li><OutLink href={configs.TRUFFLE_FRAMEWORK_URL}>The truffle framework</OutLink></li>
                        <li><OutLink href={configs.METAMASK_URL}>Metamask</OutLink></li>
                        <li><OutLink href={configs.INFURA_URL}>Infura</OutLink></li>
                        <li><OutLink href={configs.ETHEREUM_ORG_URL}>Ethereum foundation</OutLink></li>
                    </ul>
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
