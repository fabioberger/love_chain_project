const React = require('react');

function RequiredLabelText(props) {
    return (
        <span>
            {props.label}
            <span style={{color: '#ff6762'}}>*</span>
        </span>
    );
}

module.exports = RequiredLabelText;
