import _ from 'lodash';
import React from 'react';
import utils from 'js/utils/utils';
import constants from 'js/utils/constants';
import DropDownMenu from 'material-ui/DropDownMenu';
import BlockchainState from 'js/blockchain_state';
import MenuItem from 'material-ui/MenuItem';

class ProviderMenu extends React.Component {
    static propTypes = {
        blockchainState: React.PropTypes.instanceOf(BlockchainState),
    }
    constructor(props) {
        super(props);
        this.state = {
            providerType: this.props.blockchainState.getProviderType(),
        };
    }
    render() {
        const publicNodeName = this.props.blockchainState.getProviderNameForType(
            constants.PROVIDER_TYPES.publicNode
        );
        const publicNodeLabel = `Public node - ${publicNodeName}`;

        let localWeb3Label = 'In-browser Web3';
        const localWeb3Name = this.props.blockchainState.getProviderNameForType(
            constants.PROVIDER_TYPES.localWeb3
        );
        if (!_.isEmpty(localWeb3Name)) {
            localWeb3Label += ` - ${localWeb3Name}`;
        }
        return (
            <DropDownMenu
                value={this.state.providerType}
                onChange={this._onMenuSelectionChange.bind(this)} >
                <MenuItem
                    value={constants.PROVIDER_TYPES.publicNode}
                    primaryText={publicNodeLabel} />
                <MenuItem
                    value={constants.PROVIDER_TYPES.localWeb3}
                    primaryText={localWeb3Label} />
            </DropDownMenu>
        );
    }
    _onMenuSelectionChange(e, index, providerType) {
        this.props.blockchainState.updateProvider(providerType);
        this.setState({
            providerType,
        });
    }
}

export default ProviderMenu;
