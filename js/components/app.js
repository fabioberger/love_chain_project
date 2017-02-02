const _ = require('lodash');
const React = require('react');
const classNames = require('classnames');
const Link = require('react-router').Link
const utils = require('./../utils');
const BlockchainState = require('./blockchain_state');

const App = React.createClass({
    componentWillMount() {
        this._blockchainState = new BlockchainState(() => {
            this.forceUpdate();
        });
    },
    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                blockchainState: this._blockchainState
            })
        );
        const contentClassNames = classNames("mx-auto", "max-width-3");
        return (
            <div>
                <div className="topBar">
                    <div className="logo"><Link className="text-decoration-none black" to="/">Crypto Valentine</Link></div>
                </div>
                <div className={contentClassNames}>
                    <div className="clearfix">
                        <div className="center">
                            {childrenWithProps}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = App;
