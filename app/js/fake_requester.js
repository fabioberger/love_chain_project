import _ from 'lodash';
import Cookies from 'cookies-js';
import constants from 'js/utils/constants';

const COOKIE_NAME = 'fakeRequests';
const REQUEST_INTERVAL_MS = 8000;

class FakeRequester {
    constructor(addRequestFn) {
        this._addRequestFn = addRequestFn;
        this._requestSchedulerIntervalId = null;
        this._requesterAddressToStatus = this._getRequestStatusesIfExists();
    }
    static _fakeRequests = [
        {
            requesterName: 'Helga',
            valentineName: 'Lorine',
            customMessage: 'Ever since I first saw you, I knew you were the one for me. Can\'t believe it\'s been 2 years already. Looking forward to the next one aswell',
            wasAccepted: false,
            valentineAddress: '0xVHC3GV1UHVWHQXSPS617K8K61B1LRZJKFW9TID25',
            requesterAddress: '0xYYYK7K4PUTUWYI894BRNJPJHBPE0R8LVHM07YMID'
        },
        {
            requesterName: 'Etha',
            valentineName: 'Dandre',
            customMessage: 'You are the best',
            wasAccepted: false,
            valentineAddress: '0x7WM3N1ZR9HS8X1CTJX9FN2GWNTTD3BLW3088FNLL',
            requesterAddress: '0xJZW51D3JFKWSYY3VYBOH5WIVLWBIJQUIYVRHDKW4'
        },
    ]
    start(networkId) {
        if (networkId !== constants.MAINNET_ID) {
            return;
        }
        this._addAlreadySeenRequests();
        this._requestSchedulerIntervalId = setInterval(() => {
            const nextRequest = this._getNextRequest();
            if (nextRequest) {
                this._addRequestFn(nextRequest);
                this._setStatusToShown(nextRequest);
            }
        }, REQUEST_INTERVAL_MS);
    }
    _addAlreadySeenRequests() {
        const seenRequests = _.filter(FakeRequester._fakeRequests, fakeRequest => {
            return this._requesterAddressToStatus[fakeRequest.requesterAddress] === true;
        });
        _.each(seenRequests, request => {
            this._addRequestFn(request);
        });
    }
    _getNextRequest() {
        const nextRequest = _.find(FakeRequester._fakeRequests, fakeRequest => {
            return this._requesterAddressToStatus[fakeRequest.requesterAddress] === false;
        });
        if (_.isUndefined(nextRequest)) {
            clearInterval(this._requestSchedulerIntervalId);
            return null;
        } else {
            return nextRequest;
        }
    }
    _setStatusToShown(request) {
        this._requesterAddressToStatus[request.requesterAddress] = true;
        this._saveRequeseterAddressToStatus();
    }
    _saveRequeseterAddressToStatus() {
        const requesterAddressToStatusJSONString = JSON.stringify(this._requesterAddressToStatus);
        Cookies.set(COOKIE_NAME, requesterAddressToStatusJSONString);
    }
    _getRequestStatusesIfExists() {
        const requesterAddressToStatusJSONString = Cookies.get(COOKIE_NAME);
        if (_.isUndefined(requesterAddressToStatusJSONString)) {
            const requesterAddressToStatus = {};
            _.each(FakeRequester._fakeRequests, fakeRequest => {
                requesterAddressToStatus[fakeRequest.requesterAddress] = false;
            });
            Cookies.set(COOKIE_NAME, JSON.stringify(requesterAddressToStatus));
            return requesterAddressToStatus;
        }
        return JSON.parse(requesterAddressToStatusJSONString);
    }
}

export default FakeRequester;
