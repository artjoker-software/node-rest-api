import { validator } from '../request-validator';
import { shouldExecuteRequestValidation } from '../../decorators/request-validation';
import { getRequestData } from '../../../utils/http';

class ApiFilter {

  validator;

  constructor(validatorInstance) {
    this.validator = validatorInstance;
  }

  filter(request, controller, controllerAction) {
    if (Object.prototype.hasOwnProperty.call(controller, shouldExecuteRequestValidation)) {
      const { validationRules } = controller;
      const requestData = getRequestData(request);
      const correspondingValidationRule = validationRules[controllerAction.name];

      if (correspondingValidationRule) {
        this.validator.validateRequest(requestData, correspondingValidationRule);
      }
    }
  }
}

export default new ApiFilter(validator);
