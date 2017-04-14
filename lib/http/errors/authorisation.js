import HTTP_STATUS_CODE from 'http-status-codes';

export default class AuthenticationError extends Error {
  name = 'AuthorisationError';
  status = HTTP_STATUS_CODE.UNAUTHORIZED;
  message = 'Authorisation error occurred. Please, check your credentials';
  stack = (new Error()).stack;

  constructor(message) {
    super(message);
    this.message = message || this.message;
  }
}
