import co from 'co';
import { assert } from 'chai';
import simulate from '../../utils/promiseApiTester';
import { AuthorisationError } from '../../../lib/http/errors';

describe('Authorisation error suite', () => {
  it('sends throws 401 in force', () => co(function* () {
    yield simulate.get('/test-routes/middleware/error/authorisation', 401);
  }));

  it('asserts AuthenticationError class properties', () => {
    const error = new AuthorisationError('Custom authorisation error message');

    assert.equal(error.status, 401);
    assert.equal(error.name, 'AuthorisationError');
    assert.equal(error.message, 'Custom authorisation error message');
  });
});
