const _ = require('lodash');
const React = require('react');
const classNames = require('classnames');
const Link = require('react-router').Link
const MuiThemeProvider = require('material-ui/styles').MuiThemeProvider;
const getMuiTheme = require('material-ui/styles').getMuiTheme;
const colors = require('material-ui/styles').colors;
const utils = require('./../utils');
const BlockchainState = require('../blockchain_state');

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

        const muiTheme = getMuiTheme({
            palette: {
                primary1Color: colors.redA200,
                primary2Color: colors.red500,
                textColor: colors.redA200,
            },
        });

        const contentClassNames = classNames("mx-auto", "max-width-3");
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <div className="topBar">
                        <div className="logo" style={{fontFamily: 'Pacifico, cursive'}}>
                            <Link className="text-decoration-none white-text" to="/">Happy Crypto Valetines Day!</Link>
                        </div>
                    </div>
                    <div className={contentClassNames}>
                        <div className="clearfix">
                            <div className="center">
                                {childrenWithProps}
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    },
});

module.exports = App;
