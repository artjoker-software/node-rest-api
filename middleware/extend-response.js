import ResponseConfigurator from '../lib/http/response-configurator';

export default (request, response, next) => {
  ResponseConfigurator.addNoContent(response);
  ResponseConfigurator.addError(response);
  ResponseConfigurator.addOk(response);

  next();
};
