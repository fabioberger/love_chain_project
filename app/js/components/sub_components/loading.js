const React = require('react');
const Isvg = require('react-inlinesvg');

function Loading(props) {
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

module.exports = Loading;
