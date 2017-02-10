import React from 'react';
import {Paper} from 'material-ui';
import {colors} from 'material-ui/styles';

const RequestFeedPost = React.createClass({
    propTypes: {
        requesterName: React.PropTypes.string.isRequired,
        valentineName: React.PropTypes.string.isRequired,
        customMessage: React.PropTypes.string.isRequired,
        wasAccepted: React.PropTypes.bool.isRequired,
        // Improvement: Implement a custom address type to validate these proptypes
        requesterAddress: React.PropTypes.string.isRequired,
        // style: React.PropTypes.object.isRequired,
    },
    render() {
        const style = {
            // ...this.props.style,
            width: '90%',
            display: 'inline-block',
            overflow: 'hidden',
            margin: '10px',
            color: colors.grey800,
        };

        return (
            <Paper
                style={style}
                zDepth={1} >
                <div className="clearfix">
                    <div className="col col-3 pt1 pl1 left-align">
                        <span style={{fontWeight: '500'}}>To: </span>
                        {this.props.valentineName}
                    </div>
                    <div
                        className="col col-9 pt1 pr1 right-align"
                        style={{color: colors.greenA700}}>
                        {this.props.wasAccepted ? 'Accepted' : ''}
                    </div>
                </div>
                <div
                    className="pl1 pr1 pb1"
                    style={{fontFamily: 'Caveat Brush, cursive', fontSize: '22px'}}>
                    {`"${this.props.customMessage}"`}
                </div>
                <div className="pb1">- {this.props.requesterName} ({this.props.requesterAddress})</div>
            </Paper>
        );
    },
});

export default RequestFeedPost;
