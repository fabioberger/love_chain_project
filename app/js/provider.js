import _ from 'lodash';
import Web3 from 'web3';
import assert from 'js/utils/assert';
import configs from 'js/utils/configs';
import constants from 'js/utils/constants';
import ProviderEngine from 'web3-provider-engine';
import FilterSubprovider from 'web3-provider-engine/subproviders/filters.js';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc.js';

class Provider {
    constructor() {
        this._providerType = null;
        this._providerTypesToNames = {
            [constants.PROVIDER_TYPES.publicNode]: 'Infura.io',
            [constants.PROVIDER_TYPES.localNode]: 'localhost:8545',
            [constants.PROVIDER_TYPES.localWeb3]: '',
        };
        this._providerObj = null;
        // When a user switches from a local provider to the public node, we keep a copy of the unused
        // local provider in case they want to switch back to it later.
        // Note: This is only set when they switch away from using the local provider and is otherwise null
        this._unusedLocalWebProviderObj = null;

        const rawWeb3 = window.web3;
        // TODO: make this existence check more robust
        const doesWeb3InstanceExist = !_.isUndefined(rawWeb3);
        if (doesWeb3InstanceExist) {
            this._providerObj = rawWeb3.currentProvider;
            this._providerType = constants.PROVIDER_TYPES.localWeb3;
            this._providerTypesToNames[this._providerType] = this._discoverLocalWeb3ProviderName();
        } else {
            this._providerObj = this._getPublicNodeProvider();
            this._providerType = constants.PROVIDER_TYPES.publicNode;
        }
    }
    getProviderObj() {
        return this._providerObj;
    }
    getProviderType() {
        return this._providerType;
    }
    getProviderNameForType(providerType) {
        this._assertProviderType(providerType);
        return this._providerTypesToNames[providerType];
    }
    canSendTransactions() {
        return configs.PROVIDER_CONFIGS[this._providerType].canSendTransactions;
    }
    updateProvider(newProviderType) {
        this._assertProviderType(newProviderType);

        if (this._providerObj.stop) {
            this._providerObj.stop();
        }
        //If current provider is localWeb3, we need to save the provider instance so we could switch
        // back to it later
        const currentProviderType = this._providerType;
        if (currentProviderType === constants.PROVIDER_TYPES.localWeb3) {
            this._unusedLocalWebProviderObj = this._providerObj;
        }

        switch (newProviderType) {
            case constants.PROVIDER_TYPES.publicNode:
                this._providerObj = this._getPublicNodeProvider();
                break;
            case constants.PROVIDER_TYPES.localNode:
                this._providerObj = this._getLocalNodeProvider();
                break;
            case constants.PROVIDER_TYPES.localWeb3:
                this._providerObj = this._unusedLocalWebProviderObj;
                this._unusedLocalWebProviderObj = null;
                break;
            default: {
                assert(false, `Unexpected providerType encountered: ${newProviderType}`);
            }
        }
        this._providerType = newProviderType;
    }
    _assertProviderType(providerType) {
        assert(!_.isUndefined(constants.PROVIDER_TYPES[providerType]),
            'Can only set provider to a valid provider type listed in constants.PROVIDER_TYPES');
    }
    // Defaults to Infura.io Testnet
    _getPublicNodeProvider() {
        const providerObj = this._makeProvider(configs.INFURA_TESTNET_URL);
        return providerObj;
    }
    _getLocalNodeProvider() {
        const providerObj = new Web3.providers.HttpProvider(configs.LOCALHOST_URL);
        return providerObj;
    }

    _makeProvider(rpcUrl) {
        let engine = new ProviderEngine();
        engine.addProvider(new FilterSubprovider());
        engine.addProvider(new RpcSubprovider({
            rpcUrl: rpcUrl,
        }));
        engine.start();
        return engine;
    }

    _discoverLocalWeb3ProviderName() {
        if (this._providerObj.isMetaMask) {
            return 'Metamask';
        } else {
            // Default to showing the provider classname
            return this._providerObj.constructor.name;
        }
    }
}

export default Provider;
