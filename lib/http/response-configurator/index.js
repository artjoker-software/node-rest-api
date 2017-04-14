import HTTP_STATUS_CODES from 'http-status-codes';

import { okResponseModel, errorResponseModel } from '../response-models';

export default class ResponseConfigurator {

  static addNoContent(response) {
    response.noContent = (response.noContent || (() => response
      .status(HTTP_STATUS_CODES.NO_CONTENT)
      .send())
    );
  }

  static addOk(response) {
    response.ok = (response.ok || ((data) => {
      const query = response.req.query;
      return response.json(okResponseModel({ data, query }));
    }));
  }

  static addError(response) {
    response.error = (response.error || (error => response
        .status(error.status || 500)
        .json(errorResponseModel(error))));
  }

}
