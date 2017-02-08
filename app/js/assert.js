const _ = require('lodash');

const assert = (condition, message) => {
    if (!condition) {
        throw new Error('Assertion failed:', message);
    }
};

assert.isString = value => {
    assert(_.isString(value), `Expected ${value} to be a string`);
};

module.exports = assert;
