import co from 'co';
import { assert } from 'chai';
import simulate from '../../utils/promiseApiTester';
import { NotFoundError } from '../../../lib/http/errors';

describe('Not found error suite', () => {
  it('sends GET to unregistered route', () => co(function* () {
    const error = yield simulate.get('/test-routes/middleware/error/asdasdasd', 404);

    assert.equal(error.status, 404);
    assert.equal(error.name, 'NotFoundError');
    assert.equal(error.message, 'Not found error occurred. Requested route or resource doesn\'t exist. Please, check client application.');
  }));

  it('sends throws 404 in force', () => co(function* () {
    yield simulate.get('/test-routes/middleware/error/not-found', 404);
  }));

  it('asserts NotFoundError class properties', () => {
    const error = new NotFoundError('Custom not found message');

    assert.equal(error.status, 404);
    assert.equal(error.name, 'NotFoundError');
    assert.equal(error.message, 'Custom not found message');
  });
});
