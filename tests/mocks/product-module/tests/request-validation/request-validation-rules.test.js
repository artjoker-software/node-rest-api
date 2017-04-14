import co from 'co';
import { assert } from 'chai';
import simulate from '../../../../utils/promiseApiTester';

describe('Request validation suite', () => {
  it('sends GET to /request-validation with right request parameters', () => co(function* () {
    const rightQueryString = '?numberParameter=1&numberParameterRequired=2&stringParameter=hello&stringParameterRequired=bye';
    const route = `/test-routes/products/request-validation${rightQueryString}`;
    const body = yield simulate.get(route, 204);

    assert.deepEqual(body, {});
  }));

  it('sends GET to /request-validation and fails number validation', () => co(function* () {
    const wrongNumberTypValidationQueryString = '?numberParameter=what+a+good+day';
    const route = `/test-routes/products/request-validation${wrongNumberTypValidationQueryString}`;
    const error = yield simulate.get(route, 400);

    assert.equal(error.message, 'child "numberParameter" fails because ["numberParameter" must be a number]. Got what a good day (string)');
  }));

  it('sends GET to /request-validation and fails required number validation', () => co(function* () {
    const route = '/test-routes/products/request-validation';
    const error = yield simulate.get(route, 400);

    assert.equal(error.message, 'child "numberParameterRequired" fails because ["numberParameterRequired" is required]');
  }));

  it('sends GET to /request-validation and fails required string validation', () => co(function* () {
    const wrongRequiredStringTypeValidationQueryString = '?numberParameterRequired=1';
    const route = `/test-routes/products/request-validation${wrongRequiredStringTypeValidationQueryString}`;
    const error = yield simulate.get(route, 400);

    assert.equal(error.message, 'child "stringParameterRequired" fails because ["stringParameterRequired" is required]');
  }));
});
