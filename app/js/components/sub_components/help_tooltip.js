import React from 'react';
import Isvg from 'react-inlinesvg';
import ReactTooltip from 'react-tooltip';

const HelpTooltip = props => {
    return (
        <div
            className="inline-block"
            style={{width: '15px', height: '15px'}}
            data-tip
            data-for="helpTooltip" >
            <Isvg src="/svgs/help-with-circle.svg">
              <img src="/imgs/help-with-circle.gif" />
            </Isvg>
            <ReactTooltip id="helpTooltip">{props.explanation}</ReactTooltip>
        </div>
    );
}

export default HelpTooltip;
