import co from 'co';
import { assert } from 'chai';
import simulate from '../../utils/promiseApiTester';
import { BadRequestError } from '../../../lib/http/errors';

describe('Bad request error suite', () => {
  it('sends throws 400 in force', () => co(function* () {
    yield simulate.get('/test-routes/middleware/error/bad-request', 400);
  }));

  it('asserts NotFoundError class properties', () => {
    const error = new BadRequestError('Custom bad request message');

    assert.equal(error.status, 400);
    assert.equal(error.name, 'BadRequestError');
    assert.equal(error.message, 'Custom bad request message');
  });
});
