const React = require('react');

const RequiredLabelText = props => {
    return (
        <span>
            {props.label}
            <span style={{color: '#ff6762'}}>*</span>
        </span>
    );
}

module.exports = RequiredLabelText;
