import EventEmitter from 'events';
import { get as _get } from 'lodash';
import { logInfo, logError } from './logger';
import MESSAGE_CODES from './log-message-codes';

const httpClientRequestLogger = new EventEmitter();

httpClientRequestLogger.on('request', (request) => {
    logInfo({
        code: MESSAGE_CODES.outgoingRequestCode,
        message: 'Make request to external service',
        req: request,
        correlationId: _get(request, 'headers.correlationid'),
    });
});

httpClientRequestLogger.on('success', (request, response) => {
    logInfo({
        code: MESSAGE_CODES.outgoingResponseCode,
        message: 'Successful response from other service',
        req: request,
        res: response,
        correlationId: _get(request, 'headers.correlationid'),
    });
});

httpClientRequestLogger.on('error', (error, response, request) => {
    logError({
        code: MESSAGE_CODES.outgoingErrorCode,
        message: 'Error from other service',
        error,
        res: response,
        correlationId: _get(request, 'headers.correlationid'),
    });
});

export default httpClientRequestLogger;
