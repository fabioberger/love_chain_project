import React from 'react';

const OutLink = props => {
    return (
        <a
            className={props.className || ''}
            style={props.style || {}}
            href={props.href}
            target="_blank" >
            {props.children}
        </a>
    );
}

export default OutLink;
