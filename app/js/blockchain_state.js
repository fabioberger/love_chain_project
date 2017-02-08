const Web3 = require('web3');
const contract = require('truffle-contract');
const deepEqual = require('deep-equal');
const assert = require('./assert');
const ValentineRegistryArtifacts = require('../../build/contracts/ValentineRegistry.json');
const Web3Wrapper = require('./web3_wrapper');

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

class BlockchainState {
    constructor(onUpdatedFn) {
        this._onUpdatedFn = onUpdatedFn;
        this._err = null;
        this._isLoaded = false;
        this._wrappedWeb3 = null;
        this._valentineRegistry = null;
        this._valentineRequests = {};
        this._instantiateContractFireAndForgetAsync();
    }
    hasError() {
        return this._err !== null;
    }
    getError() {
        return this._err;
    }
    isLoaded() {
        return this._isLoaded;
    }
    isValidAddress(address) {
        const lowercaseAddress = address.toLowerCase();
        return this._wrappedWeb3.call('isAddress', lowercaseAddress);
    }
    getValentineRequests() {
        return _.map(this._valentineRequests, (request, requesterAddress) => request);
    }
    isRequestTargetedAtUser(valentineAddress) {
        return valentineAddress === this._wrappedWeb3.getFirstAccount() || valentineAddress === NULL_ADDRESS;
    }
    async createValentineRequestFireAndForgetAsync(requesterName, valentineName, customMessage, valentineAddress) {
        assert.isString(requesterName);
        assert.isString(valentineName);
        assert.isString(customMessage);
        assert(this.isValidAddress(valentineAddress) || _.isEmpty(valentineAddress), 'valentineAddress \
        must either be a valid ethereum address or an empty string');

        const requestOpts = {
            from: this._wrappedWeb3.getFirstAccount(),
            value: this._wrappedWeb3.call('toWei', 0.1, 'ether'),
        }
        if (_.isEmpty(valentineAddress)) {
            await this._valentineRegistry.createOpenValentineRequest(requesterName, valentineName,
                customMessage, requestOpts);
        } else {
            await this._valentineRegistry.createTargetedValentineRequest(requesterName, valentineName,
                customMessage, valentineAddress, requestOpts);
        }
    }
    async acceptValentineRequestAsync(requesterAddress) {
        assert(this.isValidAddress(requesterAddress), 'requesterAddress must be valid ethereum address');

        await this._valentineRegistry.acceptValentineRequest(requesterAddress, {
            from: this._wrappedWeb3.getFirstAccount(),
        });
    }
    async didRequesterAlreadyRequestAsync() {
        const request = await this.getRequestIfExistsAsync(this._wrappedWeb3.getFirstAccount());
        return !_.isNull(request);
    }
    async getRequestIfExistsAsync(address) {
        assert(this.isValidAddress(address), 'address must be valid ethereum address');

        const requestArr = await this._valentineRegistry.getRequestByRequestAddress.call(address);
        const request = this._convertRequestArrToObj(requestArr);
        if (!this._doesRequestExist(request)) {
            return null;
        }
        return request;
    }
    async _instantiateContractFireAndForgetAsync() {
        await this._onPageLoadAsync(); // wait for page to load
        const existingWeb3Instance = window.web3;
        const wrappedExistingWeb3 = new Web3Wrapper(existingWeb3Instance);
        const isConnectedToANetwork = wrappedExistingWeb3.isConnectedToANetworkAsync();
        if (isConnectedToANetwork) {
            // Create new instance of web3 with only the currentProvider taken from the pre-existing
            // instance so as to not depend on third-party's version of web3.
            const web3Instance = new Web3(wrappedExistingWeb3.get('currentProvider'));
            this._wrappedWeb3 = new Web3Wrapper(web3Instance);

            // instantial contract instance
            const valentineRegistry = await contract(ValentineRegistryArtifacts);
            valentineRegistry.setProvider(this._wrappedWeb3.get('currentProvider'));
            this._valentineRegistry = await valentineRegistry.deployed();

            // hydrate existing valentine requests
            this._valentineRequests = await this._getExistingRequestsAsync();

            this._startWatchingContractForEvents();
        } else {
            // TODO: replace error with backup option i.e infura.io
            this._err = 'No web3 instance detected in your browser';
        }
        this._isLoaded = true;
        this._onUpdatedFn();
    }
    async _getExistingRequestsAsync() {
        const requests = {};
        const numRequesters = await this._valentineRegistry.numRequesters.call();
        for(let i = 0; i < numRequesters.toNumber(); i++) {
            const requestArr = await this._valentineRegistry.getRequestByIndex.call(i);
            const request = this._convertRequestArrToObj(requestArr);
            requests[request.requesterAddress] = request;
        }
        return requests;
    }
    _startWatchingContractForEvents() {
        const LogValentineRequestCreated = this._valentineRegistry.LogValentineRequestCreated({}, 'latest');
        LogValentineRequestCreated.watch((err, result) => {
            if (err) {
                console.log('Warning: An error occured while listening to LogValentineRequestCreated events:', err);
                return;
            }
            const request = result.args;
            request.wasAccepted = false;

            if (!this._valentineRequests[request.requesterAddress]) {
                this._valentineRequests[request.requesterAddress] = request;
            }
        });

        const LogRequestAccepted = this._valentineRegistry.LogRequestAccepted({}, 'latest');
        LogRequestAccepted.watch((err, result) => {
            if (err) {
                console.log('Warning: An error occured while listening to LogRequestAccepted events:', err);
                return;
            }
            const eventData = result.args;

            if (this._valentineRequests[eventData.requesterAddress]) {
                this._valentineRequests[eventData.requesterAddress].wasAccepted = true;
            }
        });
    }
    async _onPageLoadAsync() {
        return new Promise((resolve,reject) => {
            window.onload = resolve;
        });
    }
    _convertRequestArrToObj(requestArr) {
        const request = {
            requesterName: requestArr[0],
            valentineName: requestArr[1],
            customMessage: requestArr[2],
            wasAccepted: requestArr[3],
            valentineAddress: requestArr[4],
            requesterAddress: requestArr[5],
        };
        return request;
    }
    _doesRequestExist(request) {
        const emptyRequestArr = ['', '', '', false, NULL_ADDRESS, NULL_ADDRESS];
        return !deepEqual(request, this._convertRequestArrToObj(emptyRequestArr));
    }
}

module.exports = BlockchainState;
