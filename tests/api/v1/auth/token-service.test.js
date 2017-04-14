import co from 'co';
import { assert } from 'chai';
import { isValid } from 'shortid';
import { tokenService } from '../../../../v1/services';

describe('Token service suite', () => {
  it('does not create same token twice', () => co(function* () {
    const token1 = yield tokenService.generate();
    const token2 = yield tokenService.generate();

    assert.notEqual(token1, token2);
  }));

  it('encodes ids and type', () => co(function* () {
    const id = 'asdasdw2';
    const token1 = yield tokenService.generate(id);
    const { user_id: userId, type } = yield tokenService.validate(token1);

    assert.equal(type, 'user');
    assert.equal(userId, id);
    assert.isTrue(isValid(userId));
  }));

  it('catches a TokenValidationError', () => co(function* () {
    try {
      yield tokenService.validate('thisis.invalid.token');
      throw new Error('Should not execute');
    } catch (error) {
      assert.equal(error.name, 'TokenValidationError');
      assert.equal(error.status, 401);
      assert.equal(error.message, 'invalid token');
    }
  }));
});
