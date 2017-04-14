import Joi from 'joi';
import { RequestValidationError } from '../errors';

class Validator {

  static DEFAULT_VALIDATION_OPTIONS = {
    allowUnknown: true
  };

  joiDefaults = {
    errorKeySeparator: 'child "',
    errorKeyEndChar: '"'
  };

  validateRequest(requestData, validationRuleSchema) {
    const { error } = Joi.validate(requestData, validationRuleSchema, Validator.DEFAULT_VALIDATION_OPTIONS);

    if (error !== null) {
      this.handleRequestValidationError(error);
    }
  }

  createFaultyObjectKeys = errorMsg => errorMsg
    .split(this.joiDefaults.errorKeySeparator)
    .slice(1)
    .map(key => key.substr(0, key.indexOf(this.joiDefaults.errorKeyEndChar)));

  getFaultyValue = (keys, passed) => {
    let badValue = passed;

    for (const key of keys) {
      badValue = badValue[key];
    }

    return badValue;
  };

  handleRequestValidationError(error) {
    const faultyKeys = this.createFaultyObjectKeys(error.message);
    const faultyValue = this.getFaultyValue(faultyKeys, error._object);

    error.name = RequestValidationError.NAME;

    if (faultyValue && typeof faultyValue !== 'object') {
      // TODO: Optimise for Object values, may be more verbose if stringified
      error.message += `. Got ${faultyValue} (${typeof faultyValue})`;
    }

    throw error;
  }

}

export default new Validator();
