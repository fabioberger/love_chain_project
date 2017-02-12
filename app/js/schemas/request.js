import Joi from 'joi-browser';

const MIN_CUSTOM_MESSAGE_LENGTH = 2;
const MAX_CUSTOM_MESSAGE_LENGTH = 140;

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 25;

const nameSpec = Joi.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).required();
const addressSpec = Joi.string().alphanum().length(42, 'utf8').regex(/^(0x)[0-9A-Za-z]{40}/);

const RequestSchema = Joi.object().keys({
    requesterName: nameSpec,
    valentineName: nameSpec,
    customMessage: Joi.string().min(MIN_CUSTOM_MESSAGE_LENGTH).max(MAX_CUSTOM_MESSAGE_LENGTH).required(),
    wasAccepted: Joi.boolean().required(),
    requesterAddress: addressSpec.required(),
    valentineAddress: addressSpec,
});

export default RequestSchema;
