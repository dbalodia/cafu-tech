import * as baseCtrl from '../../../../private/base-controller';
import { validateDataBySchema } from '../../../../private/joi-validatation-wrapper';
import MessageValidations from './validation';
import MessageHandlers from '../../handlers/message/messageHandler';

/**
 *
 * @param {Object} req - Eventemitter req stream
 * @param {Object} res - Eventemitter res stream
 * @param {Function} next - next callback in middleware chain
 */

const saveMessage = (req, res, next) => {
    const { body, payload } = req;
    baseCtrl.post(res, next, async (_) => {
        await validateDataBySchema(body, MessageValidations.saveMessageSchema);
        const responseData = await MessageHandlers.saveMessageHandler({
            data: body,
            headers: req.customHeaders,
            tokenPayload: payload,
        });
        return { content: responseData };
    });
};

/**
 *
 * @param {Object} req - Eventemitter req stream
 * @param {Object} res - Eventemitter res stream
 * @param {Function} next - next callback in middleware chain
 */

const searchMessage = (req, res, next) => {
    const { body, payload } = req;
    baseCtrl.post(res, next, async (_) => {
        await validateDataBySchema(body, MessageValidations.searchMessageSchema);
        const responseData = await MessageHandlers.searchMessageHandler({
            data: body,
            headers: req.customHeaders,
            tokenPayload: payload,
        });
        return { content: responseData };
    });
};

export {
    saveMessage,
    searchMessage,
};
