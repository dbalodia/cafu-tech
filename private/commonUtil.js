import * as dot from 'mongo-dot-notation';
import mongoose from 'mongoose';
import { get as _get, reduce as _reduce } from 'lodash';
import cleanDeep from 'clean-deep';

const checkMongoInstance = data => (data instanceof mongoose.Model ? data.toObject() : data);

const cleanEntityData = (data) => {
    let cleanData = {};
    try {
        cleanData = cleanDeep(data);
    } catch (e) {
        // log error
    }
    return cleanData;
};

const convertDataToArrIfNot = ({ data = [] }) => (Array.isArray(data) ? data : [data]);

const mapCreatedByFields = ({ data, tokenPayload }) => {
    const createdByFields = cleanEntityData({
        createdBy: {
            id: _get(tokenPayload, 'userId'),
            name: _get(tokenPayload, 'userName'),
        },
        assignedTo: {
            id: _get(tokenPayload, 'userId'),
            name: _get(tokenPayload, 'userName'),
        },
        createdOn: new Date(),
        modifiedOn: new Date(),
    });
    return { ...data, ...createdByFields };
};

const enrichArrDataToObj = ({ data, field = '' }) => _reduce(data, (acc, val) => ({ ...acc, [_get(val, field)]: val }), {});

const convertKeysToArrQry = ({ data = {} }) => _reduce(data, (acc, val, index) => ({
    ...acc,
    [index]: { $in: convertDataToArrIfNot({ data: val }) },
}), {});

const flattenObject = reqData => dot.flatten(reqData);

export {
    checkMongoInstance,
    cleanEntityData,
    mapCreatedByFields,
    enrichArrDataToObj,
    convertKeysToArrQry,
    flattenObject,
};
