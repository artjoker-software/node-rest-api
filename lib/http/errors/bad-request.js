import HTTP_STATUS_CODE from 'http-status-codes';

export default class BadRequestError extends Error {
  name = 'BadRequestError';
  status = HTTP_STATUS_CODE.BAD_REQUEST;
  message = 'Bad request error occurred. Please, check client application.';
  stack = (new Error()).stack;

  constructor(message) {
    super(message);
    this.message = message || this.message;
  }
}
