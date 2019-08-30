import { logError } from './logger';
import MESSAGE_CODES from './log-message-codes';

async function baseHandler(wrapperFunc, options) {
    let data;
    try {
        data = await wrapperFunc(options);
    } catch (err) {
        logError({
            code: MESSAGE_CODES.appResponseErrorCode,
            message: 'Error in handler',
            error: err,
        });
        throw err;
    }
    return data;
}

export default baseHandler;
