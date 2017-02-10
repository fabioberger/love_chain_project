import _ from 'lodash';
import {EventEmitter2} from 'eventemitter2';
import assert from 'js/utils/assert';

class Web3Wrapper extends EventEmitter2 {
    constructor(web3Instance) {
        super();
        this._syncMethods = [
            'isAddress',
            'toWei',
        ];
        this._callbackMethods = [
            'version.getNetwork',
        ];
        this._propertyPaths = [
            'currentProvider',
            'eth.accounts',
        ];

        if (_.isUndefined(web3Instance) || _.isNull(web3Instance)) {
            this._web3 = null;
        } else {
            this._web3 = web3Instance;
        }

        this._watchNetworkIntervalId = null;
        this._startEmittingNetworkConnectionStateAsync();
    }
    doesExist() {
        return !_.isNull(this._web3);
    }
    getFirstAccountIfExists() {
        const address = this._web3.eth.accounts[0];
        if (_.isUndefined(address)) {
            return null;
        }
        return address;
    }
    async getNetworkIdIfExists() {
        if (!this.doesExist()) {
            return null;
        }

        try {
            const networkId = await this.callAsync('version.getNetwork');
            return networkId;
        } catch(err) {
            return null;
        }
    }
    async _startEmittingNetworkConnectionStateAsync() {
        if (!_.isNull(this._watchNetworkIntervalId)) {
            return; // we are already emitting the state
        }

        let prevNetworkId = await this.getNetworkIdIfExists();
        this._watchNetworkIntervalId = setInterval(async () => {
            const currentNetworkId = await this.getNetworkIdIfExists();
            if (currentNetworkId !== prevNetworkId) {
                prevNetworkId = currentNetworkId;
                this.emit('networkConnection', currentNetworkId);
            }
        }, 1000);
    }
    _stopEmittingNetworkConnectionStateAsync() {
        clearInterval(this._watchNetworkIntervalId);
    }
    get(propertyPath) {
        assert.isString(propertyPath);

        const propPathSegments = propertyPath.split('.');
        let web3SubObj = this._web3;
        _.each(propPathSegments, prop => {
            web3SubObj = web3SubObj[prop];
        });
        return web3SubObj;
    }
    call(methodPath) {
        assert(this.doesExist(), 'Called web3Wrapper.callAsync without valid web3 instance.');
        const isAllowedSyncMethod = _.indexOf(this._syncMethods, methodPath) !== -1;
        assert(_.isString(methodPath) && isAllowedSyncMethod, 'methodPath must \
        be a string and must be included in web3\'s _syncMethods array.');

        const argumentArr = Array.prototype.slice.call(arguments);
        // Rest of params are arguments to the method
        const args = argumentArr.slice(1);
        const {methodInstance, web3SubObj} = this._getWeb3SubObjAndMethodInstanceFromMethodPath(methodPath);

        const result = methodInstance.call(web3SubObj, ...args);
        return result;
    }
    async callAsync(methodPath) {
        assert(this.doesExist(), 'Called web3Wrapper.callAsync without valid web3 instance.');
        const isAllowedAsyncMethod = _.indexOf(this._callbackMethods, methodPath) !== -1;
        assert(_.isString(methodPath) && isAllowedAsyncMethod, 'methodPath must \
        be a string and must be included in web3Wrapper\'s _asyncMethods array.');


        const argumentArr = Array.prototype.slice.call(arguments);
        // Rest of params are arguments to the method
        const args = argumentArr.slice(1);
        const {methodInstance, web3SubObj} = this._getWeb3SubObjAndMethodInstanceFromMethodPath(methodPath);

        return new Promise((resolve, reject) => {
            methodInstance.call(web3SubObj, ...args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    _getWeb3SubObjAndMethodInstanceFromMethodPath(methodPath) {
        assert.isString(methodPath);

        const methodPathSegments = methodPath.split('.');
        const methodName = methodPathSegments[methodPathSegments.length - 1];
        const intermediaryObjs = methodPathSegments.slice(0, methodPathSegments.length - 1);
        let web3SubObj = this._web3;
        _.each(intermediaryObjs, objName => {
            web3SubObj = web3SubObj[objName];
        });
        const methodInstance = web3SubObj[methodName];
        return {methodInstance, web3SubObj};
    }
    destroy() {
        this._stopEmittingNetworkConnectionStateAsync();
    }
}

export default Web3Wrapper;
