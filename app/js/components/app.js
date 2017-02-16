import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import {MuiThemeProvider, getMuiTheme, colors} from 'material-ui/styles';
import utils from 'js/utils/utils';
import BlockchainState from 'js/blockchain_state';
import SearchBox from 'js/components/sub_components/search_box';
import Footer from 'js/components/sub_components/footer';

class App extends React.Component {
    componentWillMount() {
        this._blockchainState = new BlockchainState(() => {
            this.forceUpdate();
        });
    }
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

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <div className="mx-auto max-width-4 relative" style={{height: 110}}>
                        <div className="mx-auto">
                            <div
                                className="h1 xsm-h1 center white-text"
                                style={{fontFamily: 'Pacifico, cursive'}} >
                                The Lovechain Project
                            </div>
                            <div className="white-text p2 center">
                                Declare your love immutably on the blockchain
                            </div>
                        </div>
                        <div className="search pl3">
                            <SearchBox
                                style={{position: 'absolute', bottom: 14}}
                            />
                        </div>
                        <div className="center">
                            {childrenWithProps}
                        </div>
                        <Footer />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
