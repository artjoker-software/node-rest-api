import { NotFoundError } from '../lib/http/errors';

export default (request, response, next) => (
  next(new NotFoundError())
);
