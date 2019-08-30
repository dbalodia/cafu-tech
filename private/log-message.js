// default entity for logformat

export default class LogMessage {
    constructor({
 code, message, timestamp, severity, error, correlationId, request, response, deviceInfo, stackTrace,
}) {
        this.messageCode = code;
        this.message = message;
        this.timestamp = timestamp;
        this.severity = severity;
        this.err = error;
        this.correlationId = correlationId;
        this.request = request;
        this.response = response;
        this.deviceInfo = deviceInfo;
        this.stackTrace = stackTrace;
    }
}
