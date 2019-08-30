const MESSAGE_CODES = Object.freeze({
    appStartCode: 1001,
    appFailureCode: 9001,
    appErrorCode: 9002,
    dbConnectionFailureCode: 9003,
    appResponseErrorCode: 9004,
    outgoingErrorCode: 9005,
    dbErrorCode: 9006,
    appRequestCode: 2001,
    appResponseCode: 2003,
    outgoingRequestCode: 3001,
    outgoingResponseCode: 3003,
    dbRequestCode: 4001,
    dbResponseCode: 4003,
    backGroundFuncFailureCode: 9010,
});

export default MESSAGE_CODES;
