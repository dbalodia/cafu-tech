import { get as _get, includes as _includes, map as _map } from 'lodash';
import baseHandler from '../../../../private/base-handler';
import MessageQryBuilder from '../../dbQueryBuilder/message/index';
import * as appSettings from '../../vars/appSettings';
import CustomError from '../../../../private/custom-error';

/**
 * Checking access for message provided in token
 * @param {Object} tokenPayload - Decoded Data From Jwt Token
 * @param {String} accessParam - Access parameter CREATE, READ, DELETE, UPDATE
 */

async function accessOnMessage({ tokenPayload, accessParam }) {
    const permission = _get(tokenPayload, 'permission');
    if (!_includes(permission[_get(appSettings, 'modules.audioMessage')], accessParam)) {
        const err = new CustomError(401, 'User Does Not Have Enough Permission For This Task');
        throw err;
    }
}

/**
 *
 * === Save Message from pilot ===
 * @param {Object} data - Contains message data for saving
 * @param {Object} tokenPayload - Decoded Data From Jwt Token
 */

async function saveMessageHelper({ data, tokenPayload }) {
    await accessOnMessage({ tokenPayload, accessParam: _get(appSettings, 'accessParams.create') });
    const messageRes = await MessageQryBuilder.createMessage({ data, tokenPayload });
    return messageRes;
}

async function saveMessageHandler(options) {
    return baseHandler(saveMessageHelper, options);
}

/**
 *
 * === Search Message ===
 * @param {Object} data - Contains message data for search
 * @param {Object} tokenPayload - Decoded Data From Jwt Token
 */

async function searchMessageHelper({ data, tokenPayload }) {
    await accessOnMessage({ tokenPayload, accessParam: _get(appSettings, 'accessParams.read') });
    const [messageRes] = await MessageQryBuilder.searchMessage({ data, tokenPayload });
    const message =  {
        message: _get(messageRes, 'entityData.message'),
        assignedTo: _get(messageRes, 'assignedTo.name'),
    }
    return message;
}

async function searchMessageHandler(options) {
    return baseHandler(searchMessageHelper, options);

}

export const Handlers = {
    saveMessageHandler,
    searchMessageHandler,
};

export default Handlers;
