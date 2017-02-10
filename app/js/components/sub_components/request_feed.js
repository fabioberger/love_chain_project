import _ from 'lodash';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BlockchainState from 'js/blockchain_state';
import RequestFeedPost from 'js/components/sub_components/request_feed_post';

class RequestFeed extends React.Component {
    static propTypes = {
        blockchainState: React.PropTypes.instanceOf(BlockchainState),
    }
    componentDidMount() {
        this.props.blockchainState.on('valentineRequestsUpdated', this.forceUpdate.bind(this));
    }
    componentWillUnMount() {
        this.props.blockchainState.removeListener('valentineRequestsUpdated', this.forceUpdate.bind(this));
    }
    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="feed"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={300}>
                {this._renderRequests()}
            </ReactCSSTransitionGroup>
        );
    }
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
    }
}

export default RequestFeed;
