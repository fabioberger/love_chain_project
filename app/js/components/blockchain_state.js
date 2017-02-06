const Web3 = require('web3');
const contract = require('truffle-contract');
const ValentineRegistryArtifacts = require('../../../build/contracts/ValentineRegistry.json');

class BlockchainState {
    constructor(onLoadedFn) {
        this._onLoadedFn = onLoadedFn;
        this._err = null;
        this._isLoaded = false; // TODO: Change to false
        this._web3 = null;
        this._valentineRegistry = null;
        this._instantiateContract();
    }
    hasError() {
        return this._err !== null;
    }
    isLoaded() {
        return this._isLoaded;
    }
    _instantiateContract() {
        window.addEventListener('load', () => {
            const existingWeb3 = window.web3;
            if (typeof existingWeb3 !== 'undefined') {
                // Use the Mist/wallet provider.
                this._web3 = new Web3(existingWeb3.currentProvider);
                this._valentineRegistry = contract(ValentineRegistryArtifacts);
                this._valentineRegistry.setProvider(this._web3.currentProvider);
                this._isLoaded = true;
                this._onLoadedFn()
            } else {
                // No web3 detected.
                // TODO: Show an error to the user or implement backup option
            }
        });
    }
}

module.exports = BlockchainState;
