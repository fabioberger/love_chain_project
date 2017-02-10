import React from 'react';

const RequiredLabelText = props => {
    return (
        <span>
            {props.label}
            <span style={{color: '#ff6762'}}>*</span>
        </span>
    );
}

export default RequiredLabelText;
