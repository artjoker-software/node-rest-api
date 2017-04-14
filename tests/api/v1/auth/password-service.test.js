import co from 'co';
import bcrypt from 'bcrypt';
import { assert } from 'chai';
import { stub } from 'sinon';
import { passwordService } from '../../../../v1/services';

describe('Password service suite', () => {
  const password = 'passW0r?\\//';

  it('creates a password hash', () => co(function* () {
    const hash = yield passwordService.createPasswordHash(password);

    assert.isString(hash);
    assert.equal(hash.length, 60);
  }));

  it('returns null on empty password', () => co(function* () {
    const result1 = yield passwordService.createPasswordHash();
    const result2 = yield passwordService.createPasswordHash(null);

    assert.isNull(result1);
    assert.isNull(result2);
  }));

  it('checks valid password', () => co(function* () {
    const hash = yield passwordService.createPasswordHash(password);

    const result = yield passwordService.checkPassword(password, hash);
    assert.isTrue(result, 'Wrong password');
  }));

  it('throws AuthorisationError on wrong password', () => co(function* () {
    const wrongPassword = 'password';
    const hash = yield passwordService.createPasswordHash(password);

    try {
      yield passwordService.checkPassword(wrongPassword, hash);
      throw new Error('Should not execute');
    } catch (err) {
      assert.equal(err.name, 'AuthorisationError');
      assert.equal(err.message, 'Wrong password');
    }
  }));

  it('catches synthetic bcrypt errors', () => co(function* () {
    stub(bcrypt, 'hash', (pass, sault, cb) => cb(new Error('Mock')));

    try {
      yield passwordService.createPasswordHash(password);
      throw new Error('Should not execute');
    } catch (err) {
      assert.equal(err.message, 'Mock');
    }

    bcrypt.hash.restore();

    stub(bcrypt, 'compare', (pass, sault, cb) => cb(new Error('Mock')));

    try {
      yield passwordService.checkPassword(password, password);
      throw new Error('Should not execute');
    } catch (err) {
      assert.equal(err.message, 'Mock');
    }

    bcrypt.compare.restore();
  }));
});
