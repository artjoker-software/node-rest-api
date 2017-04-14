import co from 'co';
import { assert } from 'chai';
import simulate from '../../utils/promiseApiTester';
import { InternalServerError } from '../../../lib/http/errors';

describe('Internal server error suite', () => {
  it('sends throws 500 in force', () => co(function* () {
    yield simulate.get('/test-routes/middleware/error/internal-server', 500);
  }));

  it('asserts NotFoundError class properties', () => {
    const error = new InternalServerError('Internal custom error message');

    assert.equal(error.status, 500);
    assert.equal(error.name, 'InternalServerError');
    assert.equal(error.message, 'Internal custom error message');
  });
});
