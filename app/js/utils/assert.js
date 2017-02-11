import _ from 'lodash';
import validator from 'js/schemas/validator';

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

assert.isObject = value => {
    assert(_.isObject(value), `Expected ${value} to be a object`);
};

assert.isSchemaValid = (instance, schemaName) => {
    assert.isObject(instance);
    assert.isString(schemaName);

    const validationErrs = validator.getValidationErrorsIfExists(instance, schemaName);
    if (!_.isNull(validationErrs)) {
        console.log('Schema validation failed for: ', instance);
        throw validationErrs;
    }
    // otherwise continue
}

export default assert;
