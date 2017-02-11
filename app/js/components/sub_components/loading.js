import React from 'react';
import Isvg from 'react-inlinesvg';
import {Paper} from 'material-ui';

const Loading = props => {
    const centerStyling = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    const style = {
        height: 200,
        width: 400,
        ...centerStyling,
    };

    return (
        <Paper
            style={centerStyling}
            className="p2 relative loadingPaper"
            zDepth={1} >
            <div style={{width: '300px', ...centerStyling}}>
                <div>
                    <Isvg src="/svgs/heart.svg">
                      <img src="/imgs/heart.gif" />
                    </Isvg>
                </div>
                <div>{props.message}</div>
            </div>
        </Paper>
    );
}

export default Loading;
