export const shouldExecuteRequestValidation = 'shouldExecuteRequestValidation';

// eslint-disable-next-line arrow-parens, arrow-body-style
export default validationRules => TargetClass => {
  return class RequestValidationWrapper extends TargetClass {
    validationRules = validationRules;
    shouldExecuteRequestValidation = true;
  };
};
