class ErrorSenderTestController {

  throwErrorWithoutOptions() {
    throw new Error();
  }

  throwRequestValidationError() {
    const requestValidationError = new Error();
    requestValidationError.name = 'RequestValidationError';
    throw requestValidationError;
  }

  throwValidationError() {
    const validationError = new Error();
    validationError.name = 'ValidationError';
    throw validationError;
  }
}

export default new ErrorSenderTestController();
