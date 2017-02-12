import _ from 'lodash';
import Web3 from 'web3';
import contract from 'truffle-contract';
import deepEqual from 'deep-equal';
import {EventEmitter2} from 'eventemitter2';
import utils from 'js/utils/utils';
import constants from 'js/utils/constants';
import configs from 'js/utils/configs';
import assert from 'js/utils/assert';
import ValentineRegistryArtifacts from '../../build/contracts/ValentineRegistry.json';
import Web3Wrapper from 'js/web3_wrapper';
import ValentineRequests from 'js/valentine_requests';
import faker from 'js/utils/faker';
import Provider from 'js/provider';

class BlockchainState extends EventEmitter2 {
    constructor(onUpdatedFn) {
        super();
        this._onUpdatedFn = onUpdatedFn;
        this._err = null;
        this._isLoaded = false;
        this._wrappedWeb3 = null;
        this._networkId = null;
        this._valentineRegistry = null;
        this._valentineRequests = new ValentineRequests(this._onValentineRequestsUpdated.bind(this));
        this._logValentineRequestCreated = null;
        this._logRequestAccepted = null;
        this._provider = null;
        this._eventNames = utils.keyWords([
            'valentineRequestsUpdated',
        ]);
        this._onPageLoadInitFireAndForgetAsync();
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
    // Pass-through methods to Provider class
    getProviderType() {
        return this._provider.getProviderType();
    }
    getProviderNameForType(providerType) {
        return this._provider.getProviderNameForType(providerType);
    }
    canSendTransactions() {
        return this._provider.canSendTransactions();
    }
    updateProvider(providerType) {
        assert(!_.isUndefined(constants.PROVIDER_TYPES[providerType]),
            'Can only set provider to a valid provider type listed in constants.PROVIDER_TYPES');

        this._err = null;
        this._isLoaded = false;
        this._onUpdatedFn();

        this._stopWatchingContractEvents();
        this._wrappedWeb3.removeNetworkConnectionListener(this._networkConnectionChangedAsync.bind(this));

        this._provider.updateProvider(providerType);

        const web3Instance = new Web3(this._provider.getProviderObj());
        this._wrappedWeb3 = new Web3Wrapper(web3Instance);
        this._wrappedWeb3.addNetworkConnectionListener(this._networkConnectionChangedAsync.bind(this));

        this._instantiateContractAsync();
    }
    isValidAddress(address) {
        const lowercaseAddress = address.toLowerCase();
        return this._wrappedWeb3.call('isAddress', lowercaseAddress);
    }
    getValentineRequests() {
        return this._valentineRequests.getAll();
    }
    isRequestTargetedAtUser(valentineAddress) {
        return valentineAddress === this._wrappedWeb3.getFirstAccountIfExists() || valentineAddress === constants.NULL_ADDRESS;
    }
    getFirstAccountIfExists() {
        return this._wrappedWeb3.getFirstAccountIfExists();
    }
    async createValentineRequestAsync(request) {
        assert.isSchemaValid(request, 'request');

        const requestOpts = {
            from: request.requesterAddress,
            value: this._wrappedWeb3.call('toWei', 0.1, 'ether'),
        }
        try {
            if (utils.isNullAddress(request.valentineAddress)) {
                await this._valentineRegistry.createOpenValentineRequest(request.requesterName,
                    request.valentineName, request.customMessage, requestOpts);
            } else {
                await this._valentineRegistry.createTargetedValentineRequest(request.requesterName,
                    request.valentineName, request.customMessage, request.valentineAddress, requestOpts);
            }
            this._valentineRequests.add(request);
        } catch(err) {
            // We simply log this edge-case for now. This case is reached if user rejects our transaction
            // in the Metamask/Mist confirmation step. Other possible errors can lead here too.
            console.log(`Warning: createValentineRequest failed with error: ${err}`);
        }
    }
    async acceptValentineRequestAsync(requesterAddress) {
        assert(this.isValidAddress(requesterAddress), 'requesterAddress must be valid ethereum address');

        const valentineRequest = this._wrappedWeb3.getFirstAccountIfExists();
        assert(!_.isNull(valentineRequest), 'valentineRequest must be available for a transaction to be sent.');

        try {
            await this._valentineRegistry.acceptValentineRequest(requesterAddress, {
                from: valentineRequest,
            });
        } catch(err) {
            // We simply log this edge-case for now. This case is reached if user rejects our transaction
            // in the Metamask/Mist confirmation step. Other possible errors can lead here too.
            console.log(`Warning: acceptValentineRequest failed with error: ${err}`);
        }

        this._valentineRequests.update(requesterAddress, 'wasAccepted', true);
    }
    async didRequesterAlreadyRequestAsync() {
        const requesterAddress = this._wrappedWeb3.getFirstAccountIfExists();
        assert(!_.isNull(requesterAddress), 'requesterAddress must exist to check for existing requests.');

        const request = await this.getRequestIfExistsAsync(requesterAddress);
        return !_.isNull(request);
    }
    async getRequestIfExistsAsync(address) {
        assert(this.isValidAddress(address), 'address must be valid ethereum address');

        const requestArr = await this._valentineRegistry.getRequestByRequesterAddress.call(address);
        const request = this._convertRequestArrToObj(requestArr);
        if (!this._doesRequestExist(request)) {
            return null;
        }
        return request;
    }
    async _onPageLoadInitFireAndForgetAsync() {
        await this._onPageLoadAsync(); // wait for page to load
        // Once page loaded, we can instantiate provider
        this._provider = new Provider();

        const web3Instance = new Web3(this._provider.getProviderObj());
        this._wrappedWeb3 = new Web3Wrapper(web3Instance);
        this._wrappedWeb3.addNetworkConnectionListener(this._networkConnectionChangedAsync.bind(this));

        await this._instantiateContractAsync();
    }
    async _instantiateContractAsync() {
        this._networkId = await this._wrappedWeb3.getNetworkIdIfExists();
        const doesNetworkExist = !_.isNull(this._networkId);
        if (doesNetworkExist) {
            const valentineRegistry = await contract(ValentineRegistryArtifacts);
            valentineRegistry.setProvider(this._provider.getProviderObj());
            try {
                this._valentineRegistry = await valentineRegistry.deployed();
                await this._getExistingRequestsAsync();
                this._kickoffFakeRequestAdds();
                this._createFakeRequests(10);
                if (this._provider.doesSupportEventListening()) {
                    this._startWatchingContractForEvents();
                }
            } catch(err) {
                const errMsg = `${err}`;
                if (_.includes(errMsg, 'not been deployed to detected network')) {
                    this._err = 'CONTRACT_NOT_DEPLOYED_ON_NETWORK';
                } else {
                    // We show a generic message for other possible caught errors
                    console.log('Unhandled error encountered: ', err);
                    this._err = 'UNHANDLED_ERROR';
                }
            }
        } else {
            console.log('Notice: web3.version.getNetwork returned null');
            this._err = 'DISCONNECTED_FROM_ETHEREUM_NODE';
        }
        this._isLoaded = true;
        this._onUpdatedFn();
    }
    async _getExistingRequestsAsync() {
        this._valentineRequests.clearAll();

        const numRequesters = await this._valentineRegistry.numRequesters.call();
        for(let i = 0; i < numRequesters.toNumber(); i++) {
            const requestArr = await this._valentineRegistry.getRequestByIndex.call(i);
            const request = this._convertRequestArrToObj(requestArr);
            this._valentineRequests.add(request);
        }
    }
    _createFakeRequests(num) {
        _.times(num, () => {
            const request = faker.createRequest();
            this._valentineRequests.add(request);
        });
    }
    _kickoffFakeRequestAdds() {
        setInterval(() => {
            const request = faker.createRequest();
            this._valentineRequests.add(request);
        }, 2000);
    }
    _stopWatchingContractEvents() {
        if (!_.isNull(this._logValentineRequestCreated)) {
            this._logValentineRequestCreated.stopWatching();
        }
        if (!_.isNull(this._logRequestAccepted)) {
            this._logRequestAccepted.stopWatching();
        }
    }
    _startWatchingContractForEvents() {
        // Ensure we are only ever listening to one set of events
        this._stopWatchingContractEvents();

        this._logValentineRequestCreated = this._valentineRegistry.LogValentineRequestCreated({}, 'latest');
        this._logValentineRequestCreated.watch((err, result) => {
            if (err) {
                console.log('Warning: An error occured while listening to LogValentineRequestCreated events:', err);
                return;
            }
            const request = result.args;
            request.wasAccepted = false;

            if (!this._valentineRequests.has(request.requesterAddress)) {
                this._valentineRequests.add(request);
            }
        });

        this._logRequestAccepted = this._valentineRegistry.LogRequestAccepted({}, 'latest');
        this._logRequestAccepted.watch((err, result) => {
            if (err) {
                console.log('Warning: An error occured while listening to LogRequestAccepted events:', err);
                return;
            }
            const eventData = result.args;

            if (this._valentineRequests.has(eventData.requesterAddress)) {
                this._valentineRequests.update(eventData.requesterAddress, 'wasAccepted', true);
            }
        });
    }
    async _networkConnectionChangedAsync(networkIdIfExists) {
        const isConnected = !_.isNull(networkIdIfExists);
        if (!isConnected) {
            this._err = 'DISCONNECTED_FROM_ETHEREUM_NODE';
        } else if(this._networkId !== networkIdIfExists) {
            this._err = '';
            await this._instantiateContractAsync();
            // TODO: perhaps add a snackbar notifying user of the network change
        }
        this._networkId = networkIdIfExists;
        this._onUpdatedFn();
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
        const emptyRequestArr = ['', '', '', false, constants.NULL_ADDRESS, constants.NULL_ADDRESS];
        return !deepEqual(request, this._convertRequestArrToObj(emptyRequestArr));
    }
    _onValentineRequestsUpdated() {
        this.emit(this._eventNames.valentineRequestsUpdated);
    }
}

export default BlockchainState;
