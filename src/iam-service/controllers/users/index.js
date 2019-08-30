import * as baseCtrl from '../../../../private/base-controller';
import { validateDataBySchema } from '../../../../private/joi-validatation-wrapper';
import UserValidations from './validation';
import UserHandlers from '../../handlers/users/usersHandler';

/**
 *
 * @param {Object} req - Eventemitter req stream
 * @param {Object} res - Eventemitter res stream
 * @param {Function} next - next callback in middleware chain
 */

const userLogin = (req, res, next) => {
    const { body } = req;
    baseCtrl.post(res, next, async (_) => {
        await validateDataBySchema(body, UserValidations.userLoginSchema);
        const responseData = await UserHandlers.userLoginHandler({
            data: body,
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

const userCreation = (req, res, next) => {
    const { body, payload } = req;
    baseCtrl.post(res, next, async (_) => {
        await validateDataBySchema(body, UserValidations.userCreationSchema);
        const responseData = await UserHandlers.userCreateHandler({
            data: body,
            tokenPayload: payload,
        });
        return { content: responseData };
    });
};

export {
    userLogin,
    userCreation,
};
