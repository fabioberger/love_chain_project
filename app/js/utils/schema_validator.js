import _ from 'lodash';
import Joi from 'joi-browser';
import assert from 'js/utils/assert';
import RequestSchema from 'js/schemas/request';

const nameToSchema = {
    'request': RequestSchema,
};

const schemaValidator = {
    getValidationErrorsIfExists(instance, schemaName) {
        assert.isObject(instance);
        assert.isString(schemaName);

        const schema = nameToSchema[schemaName];
        if (_.isUndefined(schema)) {
            assert(false, `${schemaName} does not have a corresponding schema defined.`);
        }
        const result = Joi.validate(instance, schema, {
            abortEarly: false, // we want to receive all errors
        });
        if (result.error) {
            return result.error;
        }
        return null;
    },
    isValid(instance, schemaName) {
        const validationErrs = this.getValidationErrorsIfExists(instance, schemaName);
        return !validationErrs;
    },
}

export default schemaValidator;
