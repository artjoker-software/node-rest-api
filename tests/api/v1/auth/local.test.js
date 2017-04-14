import co from 'co';
import omit from 'lodash/omit';
import { assert } from 'chai';
import { stub } from 'sinon';
import simulate from '../../../utils/promiseApiTester';
import mongoMapper from '../../../utils/mongo-mapper';
import userResponses from '../../../../docs/mocks/users-mock.json';
import { userService, tokenService } from '../../../../v1/services';
import { facebookPassportCallback } from '../../../../v1/services/passport/facebook';
import userMocks from '../../../../docs/db-snippets/users.json';
import mockRequest from '../../../mocks/mock-request';
import { generateMockUsers } from '../../../utils/generateMockUsers';

const apiVersion = '/v1';
const collectionName = 'users';
const route = '/login';

describe('Login suite - local strategy', () => {
  const fbData = {
    id: '1764717173787085',
    displayName: ' Johnny McFarland  Smith ',
    profileUrl: 'https://www.facebook.com/app_scoped_user_id/1764717173787085/',
    emails: [{ value: null }],
    photos: [{ value: 'https://scontent.xx.fbcdn.net/v/' }],
    provider: 'facebook'
  };
  let users = null;
  let mockUser = null;
  let mockResp = null;
  const loginData = {
    email: null,
    password: null
  };

  before(function () {
    this.timeout(5000);

    return co(function* () {
      users = yield generateMockUsers(true);

      mockUser = userMocks.find(user => !!(user.email) && !!(user.password));
      mockResp = userResponses.find(resp => resp.id === mockUser.id);

      loginData.email = fbData.emails[0].value = mockUser.email;
      loginData.password = mockUser.password;
    });
  });

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, users);
  }));

  it('logs in the user with right POST params', () => co(function* () {
    const user = yield simulate.post(apiVersion + route, loginData);

    assert.isObject(user);
    assert.isUndefined(user.password);
    assert.isString(user.access_token, 'Token not assigned');
    assert.deepEqual(omit(user, 'access_token'), mockResp);

    yield tokenService.validate(user.access_token);
  }));

  it('makes sure that email is case insensitive', () => co(function* () {
    const user = yield simulate.post(apiVersion + route, loginData);
    assert.deepEqual(omit(user, 'access_token'), mockResp);
    yield tokenService.validate(user.access_token);

    const uppercaseLogin = {
      ...loginData,
      email: loginData.email.toUpperCase()
    };

    const user2 = yield simulate.post(apiVersion + route, uppercaseLogin);
    assert.deepEqual(omit(user2, 'access_token'), mockResp);
    yield tokenService.validate(user2.access_token);
  }));

  it('logs in the user via local after model expansion via Facebook', () => co(function* () {
    let wasCalled = false;
    yield facebookPassportCallback(mockRequest, null, null, fbData, () => { wasCalled = true; });
    assert.isTrue(wasCalled, 'Did not expand the user model via facebook');

    const user = yield simulate.post(apiVersion + route, loginData);

    assert.isObject(user);
    assert.isUndefined(user.password);
    assert.deepEqual(omit(user, 'updated_at', 'access_token'), omit(mockResp, 'updated_at'));
  }));

  it('catches errors with empty data', () => co(function* () {
    const error = {
      message: 'Missing credentials',
      name: 'RequestValidationError',
      status: 400
    };

    const error1 = yield simulate.post(apiVersion + route, {}, 400);
    assert.deepEqual(error1, error);

    const error2 = yield simulate.post(apiVersion + route, { email: loginData.email }, 400);
    assert.deepEqual(error2, error);

    const error3 = yield simulate.post(apiVersion + route, { password: loginData.password }, 400);
    assert.deepEqual(error3, error);
  }));

  it('catches synthetic error inside passport callback', () => co(function* () {
    const loadByEmailStub = stub(userService, 'getByEmail', () => {
      const err = new Error('Mock');
      err.status = 400;
      throw err;
    });

    const error = yield simulate.post(apiVersion + route, loginData, 400);

    userService.getByEmail.restore();

    assert.isTrue(loadByEmailStub.calledOnce);
    assert.equal(error.message, 'Mock');
  }));

  it('catches errors with wrong data', () => co(function* () {
    const error1 = yield simulate.post(apiVersion + route, { ...loginData, password: '123' }, 401);

    assert.deepEqual(error1, {
      message: 'Wrong password',
      name: 'AuthorisationError',
      status: 401
    });

    const error2 = yield simulate.post(apiVersion + route, { ...loginData, email: 'asdasdasd' }, 401);

    assert.deepEqual(error2, {
      message: 'No user with this email',
      name: 'AuthorisationError',
      status: 401
    });
  }));
});
