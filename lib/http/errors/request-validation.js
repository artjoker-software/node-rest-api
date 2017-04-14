import HTTP_STATUS_CODE from 'http-status-codes';

export default class RequestValidationError extends Error {

  static NAME = 'RequestValidationError';

  name = RequestValidationError.NAME;
  status = HTTP_STATUS_CODE.BAD_REQUEST;
  message = 'Request validation error occurred. Please, check the data you send.';
  stack = (new Error()).stack;

  constructor(message) {
    super(message);
    this.message = message || this.message;
  }
}
