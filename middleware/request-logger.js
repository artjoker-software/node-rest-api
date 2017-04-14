import isEmpty from 'lodash/isEmpty';
import logger from '../lib/logger';

export default ({ method, params, query, body, url }, response, next) => {
  let log = `${method} ${url}\n`; // 'Received request with method on url:'

  if (!isEmpty(query)) {
    log += `==> Have query parameters:\n${JSON.stringify(query)}\n`;
  }

  if (!isEmpty(body)) {
    log += `==> Have body parameters:\n${JSON.stringify(body)}\n`;
  }

  if (!isEmpty(params)) {
    log += `==> Have URI parameters:\n${JSON.stringify(params)}\n`;
  }

  logger.info(log);

  next();
};
