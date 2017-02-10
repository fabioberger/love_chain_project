import React from 'react';
import Isvg from 'react-inlinesvg';

const Loading = props => {
    return (
        <div>
            <div>
                <Isvg src="/svgs/heart.svg">
                  <img src="/imgs/heart.gif" />
                </Isvg>
            </div>
            <div>{props.message}</div>
        </div>
    );
}

export default Loading;
