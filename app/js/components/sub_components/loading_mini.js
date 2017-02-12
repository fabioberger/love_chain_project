import React from 'react';
import Isvg from 'react-inlinesvg';
import classNames from 'classnames';

const LoadingMini = props => {
    return (
        <div
            className={classNames('relative', props.className)}
            style={{width: 12, height: 15}} >
            <div className="absolute" style={{top: 0, left: 0}}>
                <Isvg src="/svgs/mini_heart.svg">
                  <img src="/imgs/mini_heart.gif" />
                </Isvg>
            </div>
        </div>
    );
}

export default LoadingMini;
