const React = require('react');
const BlockchainState = require('../../blockchain_state');
const Paper = require('material-ui').Paper;
const colors = require('material-ui/styles').colors;

const RequestFeed = React.createClass({
    propTypes: {
        blockchainState: React.PropTypes.instanceOf(BlockchainState).isRequired,
    },
    componentDidMount() {
        // TODO: replace this with an event binding impl.
        setInterval(() => {
            this.forceUpdate();
        }, 1000);
    },
    render() {
        return (
            <div className="m3" style={{backgroundColor: "#FFCDD2"}}>
                {this._renderRequests()}
            </div>
        );
    },
    _renderRequests() {
        const style = {
            height: 97,
            width: '90%',
            margin: 10,
            display: 'inline-block',
            color: colors.grey800,
        };

        const requests = this.props.blockchainState.getValentineRequests();
        return _.map(requests, request => {
            return (
                <Paper
                    key={`${request.requesterName}-${request.valentineName}-${request.customMessage}`}
                    style={style}
                    zDepth={1} >
                    <div className="clearfix">
                        <div className="col col-3 pt1 pl1 left-align">
                            <span style={{fontWeight: '500'}}>To: </span>
                            {request.valentineName}
                        </div>
                        <div
                            className="col col-9 pt1 pr1 right-align"
                            style={{color: colors.greenA700}}>
                            {request.wasAccepted ? 'Accepted' : ''}
                        </div>
                    </div>
                    <div
                        className="pl1 pr1 pb1"
                        style={{fontFamily: 'Caveat Brush, cursive', fontSize: '22px'}}>
                        {`"${request.customMessage}"`}
                    </div>
                    <div>- {request.requesterName} ({request.requesterAddress})</div>
                </Paper>
            );
        });
    },
});

module.exports = RequestFeed;
