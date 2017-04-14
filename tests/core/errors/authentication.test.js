import co from 'co';
import { assert } from 'chai';
import simulate from '../../utils/promiseApiTester';
import { AuthenticationError } from '../../../lib/http/errors';

describe('Authentication error suite', () => {
  it('sends throws 401 in force', () => co(function* () {
    yield simulate.get('/test-routes/middleware/error/authentication', 401);
  }));

  it('asserts AuthenticationError class properties', () => {
    const error = new AuthenticationError('Custom authentication error message');

    assert.equal(error.status, 401);
    assert.equal(error.name, 'AuthenticationError');
    assert.equal(error.message, 'Custom authentication error message');
  });
});
