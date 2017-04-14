import co from 'co';
import omit from 'lodash/omit';
import passport from 'passport';
import proxyquire from 'proxyquire';
import { assert } from 'chai';
import { stub, spy } from 'sinon';
import { isValid } from 'shortid';
import simulate from '../../../utils/promiseApiTester';
import mongoMapper from '../../../utils/mongo-mapper';
import { twitterPassportCallback } from '../../../../v1/services/passport/twitter';
import { facebookPassportCallback } from '../../../../v1/services/passport/facebook';
import { userService, tokenService } from '../../../../v1/services';
import mockRequest, { emptyRequest } from '../../../mocks/mock-request';

const apiVersion = '/v1';
const route = '/twitter/callback';
const collectionName = 'users';
const omitKeys = ['updated_at', 'created_at', 'access_token', 'id', '_id', 'display_name'];

// Doesn't simulate requests (E2E task), checks internal functions only
describe('Login/signup suite - twitter strategy', () => {
  const facebookData = {
    id: '1764717173787085',
    username: undefined,
    displayName: ' Queen Elizabeth II Great ',
    name: {
      familyName: undefined,
      givenName: undefined,
      middleName: undefined
    },
    gender: undefined,
    profileUrl: 'https://www.facebook.com/app_scoped_user_id/1764717173787085/',
    emails: [{ value: 'johnsmith@gmail.com' }],
    photos: [{ value: 'https://scontent.xx.fbcdn.net/v/' }],
    provider: 'facebook'
  };

  const twitterData = {
    id: '3544358716',
    username: 'OnMmapUser',
    displayName: ' John McFarland  Smith ',
    emails: [{ value: 'johnsmith@gmail.com' }],
    photos: [{ value: 'https://abs.twimg.com/sticky/default_profile_image.png' }],
    provider: 'twitter'
  };

  const shouldBe = {
    email: 'johnsmith@gmail.com',
    first_name: 'John',
    is_activated: false,
    last_name: 'Smith',
    profile_img: 'https://abs.twimg.com/sticky/default_profile_image.png'
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
    const path = '../../../../v1/services/passport/twitter';
    const configPath = '../../../config';
    // TODO: During migration to actual production this will have to be updated

    process.env.NODE_ENV = 'development';
    const { callbackURL: devCallback } = proxyquire(path, { [configPath]: proxyquire(`../${configPath}`, {}) });
    process.env.NODE_ENV = 'test';

    assert.equal(devCallback, 'https://dev.artjoker.ua/api/v1/twitter/callback', 'Wrong development callback');

    process.env.NODE_ENV = 'production';
    const { callbackURL: prodCallback } = proxyquire(path, { [configPath]: proxyquire(`../${configPath}`, {}) });
    process.env.NODE_ENV = 'test';

    assert.equal(prodCallback, 'https://api.artjoker.ua/api/v1/twitter/callback', 'Wrong production callback');
  });

  it('signs up new user', () => co(function* () {
    const callback = stub();
    const createUserSpy = spy(userService, 'createOrUpdate');
    yield twitterPassportCallback(mockRequest, null, null, twitterData, callback);
    userService.createOrUpdate.restore();

    assert.isTrue(callback.calledOnce);
    assert.isTrue(createUserSpy.calledOnce);
    const err = callback.firstCall.args[0];
    const data = callback.firstCall.args[1];

    assert.isNull(err, 'Error occurred');
    assert.isTrue(isValid(data.id));
    assert.equal(data.first_name, 'John', 'Wrong name');
    assert.isString(data.access_token, 'Token not assigned');

    const { user_id: id } = yield tokenService.validate(data.access_token);
    assert.equal(id, data.id);

    assert.deepEqual(omit(data, omitKeys), shouldBe);
  }));

  it('aggregates data of already registered user [facebook + email + twitter]', () => co(function* () {
    const localUser = {
      email: shouldBe.email,
      password: 'mwbbziae2qlabyuhuf6eyg56qh9rdeobw6rh5lqg7yf8sr9fh0z66xe9qwzd99ir'
    };
    const callback = stub();

    yield facebookPassportCallback(emptyRequest, null, null, facebookData, callback);
    yield simulate.post(`${apiVersion}/users`, localUser);
    yield twitterPassportCallback(mockRequest, null, null, twitterData, callback);

    assert.isTrue(callback.calledTwice);
    const err = callback.secondCall.args[0];
    const data = callback.secondCall.args[1];

    assert.isNull(err, 'Error occurred');
    assert.isTrue(isValid(data.id));
    assert.deepEqual(omit(data, omitKeys), {
      ...shouldBe,
      first_name: 'Queen',
      last_name: 'Great',
      profile_img: facebookData.photos[0].value
    });

    yield mongoMapper.haveInCollection(collectionName, { email: localUser.email, twitter_id: twitterData.id, facebook_id: facebookData.id });
  }));

  it('logs in a user', () => co(function* () {
    const callback = stub();
    yield twitterPassportCallback(emptyRequest, null, null, twitterData, callback);

    const createUserSpy = spy(userService, 'createOrUpdate');
    yield twitterPassportCallback(mockRequest, null, null, twitterData, callback);
    userService.createOrUpdate.restore();

    assert.isTrue(callback.calledTwice);
    assert.isTrue(createUserSpy.notCalled);
    const err = callback.secondCall.args[0];
    const data = callback.secondCall.args[1];

    assert.isNull(err, 'Error occurred');
    assert.isTrue(isValid(data.id));
    assert.isString(data.access_token, 'Token not assigned');

    const { user_id: id } = yield tokenService.validate(data.access_token);
    assert.equal(id, data.id);

    assert.deepEqual(omit(data, omitKeys), shouldBe);
  }));

  it('catches synthetic error inside passport callback', () => co(function* () {
    const getByFacebookStub = stub(userService, 'getByTwitter', () => Promise.reject(new Error('Mock')));
    const callback = stub();
    yield twitterPassportCallback(emptyRequest, null, null, twitterData, callback);
    userService.getByTwitter.restore();

    assert.isTrue(getByFacebookStub.calledOnce);
    assert.isTrue(callback.calledOnce);
    assert.deepEqual(callback.firstCall.args[0].message, 'Mock');
  }));
});
