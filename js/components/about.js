const React = require('react');
const Link = require('react-router').Link

const About = React.createClass({
    componentDidMount() {
        window.scrollTo(0, 0);
    },
    render() {
        return (
            <div className="pb4">
                A little bit about the Crypto Valentine project.
            </div>
        );
    },
});

module.exports = About;
