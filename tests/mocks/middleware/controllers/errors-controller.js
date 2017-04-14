import { AuthenticationError, AuthorisationError, InternalServerError, BadRequestError, NotFoundError } from '../../../../lib/http/errors';

class ErrorsTestController {

  throwBadRequestError({ query }) {
    const customMessage = query.message;
    throw new BadRequestError(customMessage);
  }

  throwAuthenticationError({ query }) {
    const customMessage = query.message;
    throw new AuthenticationError(customMessage);
  }

  throwAuthorisationError({ query }) {
    const customMessage = query.message;
    throw new AuthorisationError(customMessage);
  }

  throwInternalServerError({ query }) {
    const customMessage = query.message;
    throw new InternalServerError(customMessage);
  }

  throwNotFoundError() {
    throw new NotFoundError();
  }

}

export default new ErrorsTestController();
