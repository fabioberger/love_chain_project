import _ from 'lodash';
import React from 'react';
import {Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import Ribbon from 'react-github-fork-ribbon';
import utils from 'js/utils/utils';
import CopyableAddress from 'js/components/sub_components/copyable_address';

class RequestFeedPost extends React.Component {
    static propTypes = {
        requesterName: React.PropTypes.string.isRequired,
        valentineName: React.PropTypes.string.isRequired,
        customMessage: React.PropTypes.string.isRequired,
        wasAccepted: React.PropTypes.bool.isRequired,
        // Improvement: Implement a custom address type to validate these proptypes
        requesterAddress: React.PropTypes.string.isRequired,
        valentineAddress: React.PropTypes.string,
    }
    render() {
        const style = {
            width: '100%',
            display: 'inline-block',
            overflow: 'hidden',
            color: colors.grey800,
        };

        return (
            <Paper
                className="mb2 relative"
                style={style}
                zDepth={1} >
                {this.props.wasAccepted &&
                    <Ribbon
                        style={{pointerEvents: 'none', cursor: 'default'}}
                        position="right"
                        color="green">
                        Accepted
                    </Ribbon>
                }
                <div className="clearfix">
                    <div className="col col-12 pt1 pl1 left-align">
                        <span style={{fontWeight: '500'}}>To: </span>
                        {this.props.valentineName}
                        {' '}
                        {!utils.isNullAddress(this.props.valentineAddress) &&
                            <CopyableAddress address={this.props.valentineAddress} />
                        }
                    </div>
                </div>
                <div
                    className="customMessage p1 relative center"
                    style={{fontFamily: 'Pacifico, cursive', fontSize: '18px'}}>
                    <div
                        className="absolute"
                        style={{lineHeight: 1.4, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%'}} >
                        {`"${this.props.customMessage}"`}
                    </div>
                </div>
                <div className="pb1 clearfix">
                    <div className="col col-5" style={{height: '21px'}}></div>
                    <div className="col col-7 left-align">
                        - {this.props.requesterName}{' '}
                        <CopyableAddress
                            address={this.props.requesterAddress}
                            isCopyable={true} />
                    </div>
                </div>
            </Paper>
        );
    }
}

export default RequestFeedPost;
