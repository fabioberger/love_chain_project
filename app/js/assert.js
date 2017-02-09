const _ = require('lodash');

const assert = (condition, message) => {
    if (!condition) {
        throw new Error('Assertion failed:', message);
    }
};

assert.isString = value => {
    assert(_.isString(value), `Expected ${value} to be a string`);
};

assert.isFunction = value => {
    assert(_.isFunction(value), `Expected ${value} to be a function`);
};

module.exports = assert;
