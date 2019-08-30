import { convertKeysToArrQry } from '../../../../private/commonUtil';
import MessageMappers from '../../service/message/mapper';
import MessageModel from '../../models/message';

/**
 *
 * @param {Object} data - data required for saving into the database
 * @param {Object} tokenPayload - Decoded data from jwt
 */

async function createMessage({ data, tokenPayload }) {
    const finalData = MessageMappers.mapMessageCreation({ data, tokenPayload });
    const message = await MessageModel.createEntity({ data: finalData });
    return message;
}

/**
 *
 * @param {Object} data - data required for seaching
 */

async function searchMessage({ data }) {
    const { $set: notationalQry } = MessageMappers.qryMapperForMessage({ reqData: data });
    const qryFields = convertKeysToArrQry({ data: notationalQry });
    const message = await MessageModel.findEntities({ qryFields });
    return message;
}


export const DbQueryBuilder = {
    createMessage,
    searchMessage,
};
export default DbQueryBuilder;
