import HTTP_STATUS_CODE from 'http-status-codes';

export default class NotFoundError extends Error {
  name = 'NotFoundError';
  status = HTTP_STATUS_CODE.NOT_FOUND;
  message = 'Not found error occurred. Requested route or resource doesn\'t exist. Please, check client application.';
  stack = (new Error()).stack;

  constructor(message) {
    super(message);
    this.message = message || this.message;
  }
}
