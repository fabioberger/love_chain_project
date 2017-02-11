import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Isvg from 'react-inlinesvg';
import ReactTooltip from 'react-tooltip';
import CopyToClipboard from 'react-copy-to-clipboard';
import {colors} from 'material-ui/styles';

class CopyableAddress extends React.Component {
    static propTypes = {
        address: React.PropTypes.string.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            isHovering: false,
        };
        this._copyTooltipTimeoutId = null;
    }
    componentDidUpdate() {
        // Remove tooltip if hover away
        if(!this.state.isHovering && this._copyTooltipTimeoutId) {
            clearInterval(this._copyTooltipTimeoutId);
            this._hideTooltip();
        }
    }
    _setHoverState(isHovering) {
        this.setState({
            isHovering: isHovering,
        });
    }
    _onCopy() {
        if (this._copyTooltipTimeoutId) {
            clearInterval(this._copyTooltipTimeoutId);
        }

        const tooltipLifespanMs = 1000;
        this._copyTooltipTimeoutId = setTimeout(() => {
            this._hideTooltip();
        }, tooltipLifespanMs);
    }
    _hideTooltip() {
        ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.copyable));
    }
    render() {
        return (
            <div className="inline-block">
                    <CopyToClipboard text={this.props.address} onCopy={() => this._onCopy()}>
                        <div
                            className="inline relative pl1"
                            style={{cursor: 'pointer', color: colors.red500}}
                            ref="copyable"
                            data-tip
                            data-for="copy"
                            data-event="click"
                            data-iscapture={true} // This let's the click event continue to propogate
                            onMouseOver={() => this._setHoverState(true)}
                            onMouseOut={() => this._setHoverState(false)} >
                            <div
                                className="inline-block absolute"
                                style={{width: '15px', height: '15px', top: '1px'}} >
                                <Isvg src="/svgs/content_copy.svg">
                                  <img src="/imgs/content_copy.gif" />
                                </Isvg>
                            </div>
                            <div
                                className="copyableAddressAddress inline-block absolute"
                                style={{paddingLeft: '19px', fontSize: '14px', top: '1px'}}>
                                {this.props.address.substr(0, 6)}
                                {this.state.isHovering &&
                                    this.props.address.substr(6)
                                }
                            </div>
                        </div>
                    </CopyToClipboard>
                <ReactTooltip id="copy" type="error">Copied!</ReactTooltip>
            </div>
        );
    }
}

export default CopyableAddress;
