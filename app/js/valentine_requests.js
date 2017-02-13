import _ from 'lodash';
import assert from 'js/utils/assert';

class ValentineRequests {
    constructor(onUpdatedFn) {
        this._onUpdatedFn = onUpdatedFn; // Must be called whenever ValentineRequests changes
        this._requestsByRequesterAddress = {};
        this._orderedRequesterAddresses = [];
    }
    add(request) {
        assert.isSchemaValid(request, 'request');

        this._requestsByRequesterAddress[request.requesterAddress] = request;
        if (!_.includes(this._orderedRequesterAddresses, request.requesterAddress)) {
            this._orderedRequesterAddresses = [request.requesterAddress, ...this._orderedRequesterAddresses];
        }
        this._onUpdatedFn();
    }
    has(requesterAddress) {
        return !!this._requestsByRequesterAddress[requesterAddress];
    }
    update(requesterAddress, key, value) {
        assert(this.has(requesterAddress), 'Cannot update non-existent request');
        this._requestsByRequesterAddress[requesterAddress][key] = value;
        this._onUpdatedFn();
    }
    getAll() {
        return _.map(this._orderedRequesterAddresses, requesterAddress => {
            return this._requestsByRequesterAddress[requesterAddress];
        });
    }
    clearAll() {
        this._requestsByRequesterAddress = {};
        this._orderedRequesterAddresses = [];
        this._onUpdatedFn();
    }
}

export default ValentineRequests;
