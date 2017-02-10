import React from 'react';

class About extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <div className="pb4">
                A little bit about the Crypto Valentine project.
            </div>
        );
    }
}

export default About;
