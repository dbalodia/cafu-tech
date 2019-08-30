/*
@TODO: add addstream and addserializer capability by exposing wrapper methods
@TODO: separate out date util after adding it as npm package
*/
import { createLogger, nameFromLevel } from 'bunyan';
import useragent from 'useragent';
import stackTrace from 'stack-trace';
import LogMessage from './log-message';
import { formatDateTime } from './date-util';

// assuming one logger per app
let logger;

// serializers
const requestSerializer = req => ({
    reqId: req.reqId,
    correlationId: req.correlationId,
    url: req.url || req.href || req.uri,
    method: req.method,
    requestHeaders: req.headers,
    requestBody: req.body,
});

const responseSerializer = res => ({
    reqId: res.reqId,
    statusCode: res.statusCode,
    responseHeaders: res.headers || res._headers,
    responseBody: res.body,
});

// const errSerializer = err => err;

const userAgentSerializer = (reqHeaders) => {
    const agent = useragent.parse(reqHeaders['user-agent']);

    return agent.toJSON();
};

const stackTraceSerializer = (err) => {
    const trace = stackTrace.parse(err)[0];
    return {
        stack: err.stack,
        typeName: trace.getTypeName(),
        fileName: trace.getMethodName(),
        functionName: trace.getFunctionName(),
    };
};

// serializer for user object
// const userInfoSerializer = userInfo => ({
//       id: userInfo.id,
//       token: userInfo.token,
// });

const getLogger = () => logger;
// create and set logger
const createBunyanLogger = (options) => {
    if  (!logger)   {
        // options while instantiating logger
        const bunyanOptions = {
            name: options.appName,
            level: options.logLevel,
            streams: options.logStreams,
            serializers: options.logSerializers,
            src: options.logSrc || false,
            offset: options.offset,
            timezone: options.timezone,
            componentName: options.appName,
            componentVersion: options.appVersion,
        };
       logger = createLogger(bunyanOptions);
    }
    return logger;
};

const getLoggerLevel = () => nameFromLevel[logger.level()];

const setLoggerLevel = levelVal => logger.level(levelVal);


// wrappers for logger methods
const logError = ({
 code, error, req, res, correlationId, timestamp, message, deviceInfo,
}) => {
    if(!logger){
        console.error(error);
        return;
    }
    // check for error instance
    // check case if extra params needed
    const errorMsg = new LogMessage({
        code,
        message,
        severity: 'ERROR',
        error,
        request: req && requestSerializer(req),
        response: res && responseSerializer(res),
        correlationId,
        deviceInfo: deviceInfo && req && req.headers && userAgentSerializer(req.headers),
        timestamp: timestamp || formatDateTime(),
        stackTrace: error && error.stack && stackTraceSerializer(error),
    });
    return logger.error(errorMsg);
};

const logInfo = ({
 code, message, req, res, correlationId, deviceInfo, timestamp,
}) => {
    if(!logger){
        console.info(message);
        return;
    }
    const infoMsg = new LogMessage({
        code,
        severity: 'INFO',
        message,
        request: req && requestSerializer(req),
        response: res && responseSerializer(res),
        correlationId,
        deviceInfo: deviceInfo && req && req.headers && userAgentSerializer(req.headers),
        timestamp: timestamp || formatDateTime(),
    });
    return logger.info(infoMsg);
};

// @TODO: for debug trace and warn
export {
    createBunyanLogger as createLogger,
    getLogger,
    getLoggerLevel,
    setLoggerLevel,
    logInfo,
    logError,
};
