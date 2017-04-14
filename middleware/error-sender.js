import HTTP_STATUS_CODE from 'http-status-codes';

import logger from '../lib/logger';

const errorMapper = (error) => {
  // in case if error was built correctly
  if (error.status) {
    logger.error(error);
    return error;
  }

  switch (error.name) {
    case 'ValidationError':
      error.status = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
      error.details = error.errors;
      break;

    case 'RequestValidationError':
      error.status = HTTP_STATUS_CODE.BAD_REQUEST;
      break;

    default:
      error.status = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
      error.name = 'InternalServerError';
      break;
  }

  logger.error(error);

  return error;
};

export default (error, request, response, next) => response.error(errorMapper(error), next);
