import HTTP_STATUS_CODE from 'http-status-codes';

export default class InternalServerError extends Error {
  name = 'InternalServerError';
  status = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  message = 'Server error occurred. Please, check server application.';
  stack = (new Error()).stack;

  constructor(message) {
    super(message);
    this.message = message || this.message;
  }
}
