import co from 'co';
import omit from 'lodash/omit';
import passport from 'passport';
import proxyquire from 'proxyquire';
import { assert } from 'chai';
import { stub, spy } from 'sinon';
import { isValid } from 'shortid';
import simulate from '../../../utils/promiseApiTester';
import mongoMapper from '../../../utils/mongo-mapper';
import { facebookPassportCallback } from '../../../../v1/services/passport/facebook';
import { userService, tokenService } from '../../../../v1/services';
import mockRequest, { emptyRequest } from '../../../mocks/mock-request';

const apiVersion = '/v1';
const route = '/facebook/callback';
const collectionName = 'users';
const omitKeys = ['updated_at', 'created_at', 'access_token', 'id', '_id', 'display_name'];

// Doesn't simulate requests (E2E task), checks internal functions only
describe('Login/signup suite - facebook strategy', () => {
  const fbData = {
    id: '1764717173787085',
    username: undefined,
    displayName: ' Johnny McFarland  Smith ',
    name: {
      familyName: undefined,
      givenName: undefined,
      middleName: undefined
    },
    gender: undefined,
    profileUrl: 'https://www.facebook.com/app_scoped_user_id/1764717173787085/',
    emails: [{ value: 'johnnysmith@gmail.com' }],
    photos: [{ value: 'https://scontent.xx.fbcdn.net/v/' }],
    provider: 'facebook'
  };

  const shouldBe = {
    email: 'johnnysmith@gmail.com',
    first_name: 'Johnny',
    is_activated: false,
    last_name: 'Smith',
    profile_img: 'https://scontent.xx.fbcdn.net/v/'
  };

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
  }));

  it('attempts to make a request (coverage reasons only)', () => co(function* () {
    // Brave soul, don't even try to understand why and how it works
    const authMock = stub(passport, 'authenticate', (...args) => args[2]([null, true, null], { ok: () => {} }));
    yield simulate.get(apiVersion + route, 500);
    passport.authenticate.restore();

    assert.isTrue(authMock.calledOnce);
  }));

  it('checks correct callback URL in different ENV', () => {
    const path = '../../../../v1/services/passport/facebook';
    const configPath = '../../../config';
    // TODO: During migration to actual production this will have to be updated

    process.env.NODE_ENV = 'development';
    const { callbackURL: devCallback } = proxyquire(path, { [configPath]: proxyquire(`../${configPath}`, {}) });
    process.env.NODE_ENV = 'test';

    assert.equal(devCallback, 'https://dev.artjoker.ua/api/v1/facebook/callback', 'Wrong development callback');

    process.env.NODE_ENV = 'production';
    const { callbackURL: prodCallback } = proxyquire(path, { [configPath]: proxyquire(`../${configPath}`, {}) });
    process.env.NODE_ENV = 'test';

    assert.equal(prodCallback, 'https://api.artjoker.ua/api/v1/facebook/callback', 'Wrong production callback');
  });

  it('signs up new user', () => co(function* () {
    const callback = stub();
    const createUserSpy = spy(userService, 'createOrUpdate');

    yield facebookPassportCallback(mockRequest, null, null, fbData, callback);
    userService.createOrUpdate.restore();

    assert.isTrue(callback.calledOnce);
    assert.isTrue(createUserSpy.calledOnce);
    const err = callback.firstCall.args[0];
    const data = callback.firstCall.args[1];

    assert.isNull(err, 'Error occurred');
    assert.isTrue(isValid(data.id));
    assert.equal(data.first_name, 'Johnny', 'Wrong name');
    assert.isString(data.access_token, 'Token not assigned');

    const { user_id: id } = yield tokenService.validate(data.access_token);
    assert.equal(id, data.id);

    assert.deepEqual(omit(data, omitKeys), shouldBe);
  }));

  it('Aggregates data of already registered user [email + facebook]', () => co(function* () {
    const localUser = {
      email: shouldBe.email,
      password: 'ai80fgo8gq0ybjnjrg9cthksh1mw301s51st18ycnh2vwpmg1io150kbnhkjmg71'
    };
    const callback = stub();
    yield simulate.post(`${apiVersion}/users`, localUser);
    yield facebookPassportCallback(emptyRequest, null, null, fbData, callback);

    assert.isTrue(callback.calledOnce);
    const err = callback.firstCall.args[0];
    const data = callback.firstCall.args[1];

    assert.isNull(err, 'Error occurred');
    assert.isTrue(isValid(data.id));
    assert.deepEqual(omit(data, omitKeys), shouldBe);

    yield mongoMapper.haveInCollection(collectionName, { email: localUser.email, facebook_id: fbData.id });
  }));

  it('logs in a user', () => co(function* () {
    const callback = stub();
    yield facebookPassportCallback(emptyRequest, null, null, fbData, callback);

    const createUserSpy = spy(userService, 'createOrUpdate');
    yield facebookPassportCallback(mockRequest, null, null, fbData, callback);
    userService.createOrUpdate.restore();

    assert.isTrue(callback.calledTwice);
    assert.isTrue(createUserSpy.notCalled);
    const err = callback.secondCall.args[0];
    const data = callback.secondCall.args[1];

    assert.isNull(err, 'Error occurred');
    assert.isTrue(isValid(data.id));
    assert.equal(data.first_name, 'Johnny', 'Wrong display name');
    assert.isString(data.access_token, 'Token not assigned');

    const { user_id: id } = yield tokenService.validate(data.access_token);
    assert.equal(id, data.id);

    assert.deepEqual(omit(data, omitKeys), shouldBe);
  }));

  it('catches synthetic error inside passport callback', () => co(function* () {
    const getByFacebookStub = stub(userService, 'getByFacebook', () => Promise.reject(new Error('Mock')));
    const callback = stub();
    yield facebookPassportCallback(emptyRequest, null, null, fbData, callback);
    userService.getByFacebook.restore();

    assert.isTrue(getByFacebookStub.calledOnce);
    assert.isTrue(callback.calledOnce);
    assert.deepEqual(callback.firstCall.args[0].message, 'Mock');
  }));
});
