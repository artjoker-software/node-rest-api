import HTTP_STATUS_CODE from 'http-status-codes';

export default class AuthenticationError extends Error {
  name = 'AuthenticationError';
  status = HTTP_STATUS_CODE.UNAUTHORIZED;
  message = 'Authentication error occurred. Please, check client application credentials';
  stack = (new Error()).stack;

  constructor(message) {
    super(message);
    this.message = message || this.message;
  }
}
