import fs from 'fs';
// import { Map } from 'immutable';
import qs from 'qs';
import * as dot from 'mongo-dot-notation';
import mongoose from 'mongoose';
import { map as _map, get as _get, reduce as _reduce } from 'lodash';
import cleanDeep from 'clean-deep';
import path from 'path';
import util from 'util';
import joinUrl from 'url-join';

// Convert fs.readFile into Promise version of same
const promisifiedReadFile = util.promisify(fs.readFile);

const promisifiedWriteFile = util.promisify(fs.writeFile);

const promisifiedUnlinkFile = util.promisify(fs.unlink);

const safeObjectId = (stringId) => {
    const objectId = mongoose.Types.ObjectId.isValid(stringId) ? new mongoose.Types.ObjectId(stringId) : undefined;
    return objectId;
};

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

const makeUrl = (baseUrl, [...relativeUrl]) => {
    let relUrl;
    if (relativeUrl && relativeUrl.length) {
        relUrl = relativeUrl.join('/');
    }
    const url = baseUrl ? joinUrl(baseUrl, relUrl) : joinUrl(relUrl);
    return url;
};

/*
A memoized function for concatenating the urls to avoid the concatenation during every request
*/
const memoizedUrlGenerator = (dirName) => {
    let cache = Map({
        [dirName]: Map(),
    });
    return (serviceName, relativeUrl) => {
        // Composite key per module
        const key = [dirName, relativeUrl];
        if (cache.hasIn(key)) {
            return cache.getIn(key);
        }
        const value = makeUrl(serviceName, [relativeUrl]);
        cache = cache.setIn(key, value);
        return value;
    };
};

const convertObjToQueryString = (queryObj = {}, keyToMap) => {
    const jsonStringifiedObj = { [keyToMap]: JSON.stringify(queryObj) };
    return qs.stringify(jsonStringifiedObj);
};

const convertDataToArrIfNot = ({ data = [] }) => (Array.isArray(data) ? data : [data]);

const convertIdsToObjectId = data => _map(data, item => safeObjectId(item));

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

const mapModifiedByFields = ({ data, tokenPayload }) => {
    const modifiedByFields = {
        modifiedBy: {
            id: _get(tokenPayload, 'userId'),
            name: _get(tokenPayload, 'userName'),
        },
        modifiedOn: new Date(),
    };
    return { ...data, ...modifiedByFields };
};

const enrichArrDataToObj = ({ data, field = '' }) => _reduce(data, (acc, val) => ({ ...acc, [_get(val, field)]: val }), {});

const dataFilter = ({ tokenPayload }) => {
    const orgIdsAsObjectIds = convertIdsToObjectId(Array.isArray(_get(tokenPayload, 'orgIds'))
        ? _get(tokenPayload, 'orgIds') : [_get(tokenPayload, 'orgIds')]);
    const orgIdsAsStrings = Array.isArray(_get(tokenPayload, 'orgIds'))
        ? _get(tokenPayload, 'orgIds') : [_get(tokenPayload, 'orgIds')];
    const companyIds = convertIdsToObjectId(_get(tokenPayload, 'companyIds'));
    const userId = _get(tokenPayload, 'userId');
    const dataAccessLevel = _get(tokenPayload, 'dataAccessLevel');
    let filterQry;
    if (dataAccessLevel === dataAccessLevels.superAdminLevel) {
        filterQry = {};
    } else if (dataAccessLevel === dataAccessLevels.companyLevel) {
        filterQry = { companyId: { $in: companyIds } };
    } else if (dataAccessLevel === dataAccessLevels.organizationLevel) {
        filterQry = {
            companyId: { $in: companyIds },
            $or: [
                { 'organization.value': { $in: orgIdsAsStrings } },
                { orgId: { $in: orgIdsAsObjectIds } }],
        };
    } else if (dataAccessLevel === dataAccessLevels.userLevel) {
        filterQry = {
            companyId: { $in: companyIds },
            $or: [{ 'createdBy.id': userId }, { 'assignedTo.id': userId }],
        };
    } else {
        // @TODO: remove once all the access level set into the token
        filterQry = { companyId: { $in: companyIds } };
    }
    return filterQry;
};

const convertKeysToArrQry = ({ data = {} }) => _reduce(data, (acc, val, index) => ({
    ...acc,
    [index]: { $in: convertDataToArrIfNot({ data: val }) },
}), {});

const flattenObject = reqData => dot.flatten(reqData);

export {
    promisifiedReadFile,
    checkMongoInstance,
    makeUrl,
    cleanEntityData,
    safeObjectId,
    memoizedUrlGenerator,
    convertObjToQueryString,
    promisifiedWriteFile,
    promisifiedUnlinkFile,
    mapCreatedByFields,
    mapModifiedByFields,
    enrichArrDataToObj,
    convertKeysToArrQry,
    flattenObject,
    dataFilter,
};
