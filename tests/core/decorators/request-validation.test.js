import { assert } from 'chai';
import { requestValidation } from '../../../lib/decorators';
import { shouldExecuteRequestValidation } from '../../../lib/decorators/request-validation';

describe('Request validation decorator suite', () => {
  const mockValidationRules = {
    rule1: {},
    rule2: {}
  };

  @requestValidation(mockValidationRules)
  class SomeMockClass {}

  it('checks decorated class props', () => {
    const instanceOfDecoratedClass = new SomeMockClass();

    assert.equal(instanceOfDecoratedClass[shouldExecuteRequestValidation], true);
    assert.equal(instanceOfDecoratedClass.validationRules, mockValidationRules);
  });
});
