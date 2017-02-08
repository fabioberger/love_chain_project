const assert = require('./assert');

class Web3Wrapper {
    constructor(web3Instance) {
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
    }
    doesExist() {
        return !_.isNull(this._web3);
    }
    getFirstAccount() {
        return this._web3.eth.accounts[0]
    }
    async isConnectedToANetworkAsync() {
        if (!this.doesExist()) {
            return false;
        }

        try {
            await this.callAsync('version.getNetwork');
            return true;
        } catch(err) {
            return false;
        }
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
}

module.exports = Web3Wrapper;
