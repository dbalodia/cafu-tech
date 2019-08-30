export default class CustomError extends Error {
    constructor(statusCode = 400, ...params) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super(...params);

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }

      // Custom debugging information
      this.statusCode = statusCode;
    }
}

