const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const BlockchainState = require('js/blockchain_state');
const RequestFeedPost = require('js/components/sub_components/request_feed_post');

const RequestFeed = React.createClass({
    propTypes: {
        blockchainState: React.PropTypes.instanceOf(BlockchainState).isRequired,
    },
    componentDidMount() {
        this.props.blockchainState.on('valentineRequestsUpdated', this.forceUpdate.bind(this));
    },
    componentWillUnMount() {
        this.props.blockchainState.removeListener('valentineRequestsUpdated', this.forceUpdate.bind(this));
    },
    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="feed"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={300}>
                {this._renderRequests()}
            </ReactCSSTransitionGroup>
        );
    },
    _renderRequests() {
        const requests = this.props.blockchainState.getValentineRequests();
        return _.map(requests, request => {
            return <RequestFeedPost
                key={request.requesterAddress}
                requesterName={request.requesterName}
                valentineName={request.valentineName}
                customMessage={request.customMessage}
                wasAccepted={request.wasAccepted}
                requesterAddress={request.requesterAddress} />
        });
    },
});

module.exports = RequestFeed;
