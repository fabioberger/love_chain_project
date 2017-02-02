class BlockchainState {
    constructor(onLoadedFn) {
        this._onLoadedFn = onLoadedFn;
        this._err = null;
        this._isLoaded = false;
        this._fetchExistingValentineContractState();
    }
    hasError() {
        return this._err !== null;
    }
    isLoaded() {
        return this._isLoaded;
    }
    _fetchExistingValentineContractState() {
        // TODO: Use web3 to fetch valentine contract state
    }
}

module.exports = BlockchainState;
