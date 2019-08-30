import { get as _get } from 'lodash';
import * as HttpStatus from 'http-status-codes';
import { logError } from '../private/logger';
import MESSAGE_CODES from './log-message-codes';

/* eslint-disable no-unreachable */
const sendErrorResponse = (err, next, res) => {
  const statusCode = _get(err, 'error.statusCode') || _get(err, 'statusCode') || (() => {
    const errCode = _get(err, 'error.code', '');
    return errCode.match(/(ETIMEDOUT|ENETUNREACH)/ig) ? 504 : false;
  })() || 500;
  const message = _get(err, 'error.message') || _get(err, 'message') || 'Server Error';

  logError({
    code: MESSAGE_CODES.appResponseErrorCode,
    message: 'Response Error',
    error: err,
    req: _get(res, 'req'),
    res,
  });
  res.status(statusCode).send({ message, code: statusCode });
  return next(false);
};

async function postResourceAsync(res, next, func) {
  let bgFunc;
  // req-res specific try catch
  try {
    const data = await func();
    const content = _get(data, 'content');
    const message = _get(data, 'message');
    bgFunc = _get(data, 'bgFunc', false);
    if (!content) {
      res.status(HttpStatus.CREATED).send({ message: message || HttpStatus.getStatusText(HttpStatus.CREATED) });
    } else {
      res.status(HttpStatus.CREATED).send({ data: content, message });
    }
  } catch (e) {
    return sendErrorResponse(e, next, res);
  }

  try {
    bgFunc && bgFunc();
  } catch (e) {
    logError({
      code: MESSAGE_CODES.backGroundFuncFailureCode,
      message: 'Backgrond Func Error',
      error: e,
    });
  }
  return next(false);
}

export {
  postResourceAsync as post,
};
