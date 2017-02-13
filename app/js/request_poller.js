const POLLING_INTERVAL_MS = 5000;

class RequestPoller {
    constructor(numRequesters, addValentineRequestFn, getRequestByIndexIfExistsAsyncFn) {
        this._numRequesters = numRequesters;
        this._addValentineRequestFn = addValentineRequestFn;
        this._requestPollerIntervalId = null;
        this._getRequestByIndexIfExistsAsyncFn = getRequestByIndexIfExistsAsyncFn;
    }
    start() {
        this._requestPollerIntervalId = setInterval(async () => {
            const nextRequestIndex = this._numRequesters;
            const request = await this._getRequestByIndexIfExistsAsyncFn(nextRequestIndex);
            if (request) {
                this._addValentineRequestFn(request);
                this._numRequesters++;
            }
        }, POLLING_INTERVAL_MS);
    }
    stop() {
        clearInterval(this._requestPollerIntervalId);
    }
}

export default RequestPoller;
