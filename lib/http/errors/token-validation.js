import HTTP_STATUS_CODE from 'http-status-codes';

export default class TokenValidationError extends Error {
  name = 'TokenValidationError';
  status = HTTP_STATUS_CODE.UNAUTHORIZED;
  message = 'Token validation error occurred. Please, check your credentials.';
  stack = (new Error()).stack;

  constructor(message) {
    super(message);
    this.message = message || this.message;
  }
}
