import Joi from 'joi';
import R from 'ramda';
import CustomError from './custom-error';

const validateDataBySchema = (data, schema, successCb, failurCb, options = { allowUnknown: true, abortEarly: true }) =>
    Joi.validate(data, schema, { allowUnknown: options.allowUnknown, abortEarly: options.abortEarly })
        .then(successCb).catch(failurCb);

// helper functions for extracting joi error values
const entityNameExtractor = R.path(['context', 'path']);

const nestedErrorExtractorDepth1 = R.path(['context', 'reason', 0, 'context', 'reason', 0, 'flags', 'error']);

// @TODO: make ramda methods
const dupeEntityValueExtractor = error => R.path(['context', 'dupeValue', R.path(['context', 'path'], error)], error);

const arrayUniqueValueErrorHandler = (errorType, error) => {
    const entityName = entityNameExtractor(error);
    const dupeValue = dupeEntityValueExtractor(error);
    return new CustomError(400, `Field ${entityName} with value ${dupeValue} are duplicated`);
};

const arrayNestedRequiredHandler = (errorType, error) => {
    const nestedErrorObj = nestedErrorExtractorDepth1(error);
    return new CustomError(R.path(['statusCode'], nestedErrorObj) || 400, R.path(['message'], nestedErrorObj));
};

const defaultHandler = (errorType, error) => error.message;

const errorHandleMapper = R.cond([
    [R.equals('array.unique'), arrayUniqueValueErrorHandler],
    [R.equals('array.includesOne'), arrayNestedRequiredHandler],
    [R.T, defaultHandler],
]);

const joiErrorHandler = error => errorHandleMapper(error.type, error);

const joiMultipleErrorHandler = errors => errors.map(joiErrorHandler);

export default validateDataBySchema;
export {
    validateDataBySchema,
    joiErrorHandler,
    joiMultipleErrorHandler,
};
