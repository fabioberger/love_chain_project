const React = require('react');
const Link = require('react-router').Link
const BlockchainState = require('./blockchain_state');

const Home = React.createClass({
    propTypes: {
        blockchainState: React.PropTypes.instanceOf(BlockchainState),
    },
    componentDidMount() {
        window.scrollTo(0, 0);
    },
    render() {
        return (
            <div>
                {!this.props.blockchainState.isLoaded() ?
                    "Loading..." :
                    this._renderValentineFeed()
                }
            </div>
        );
    },
    _renderValentineFeed() {
        if (this.props.blockchainState.hasError()) {
            return 'An error occurred. Please try refreshing';
        }

        return (
            <div className="pb4">
                TODO: Build valentine feed here
            </div>
        );
    },
});

module.exports = Home;
