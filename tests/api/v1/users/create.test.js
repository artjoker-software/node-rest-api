import co from 'co';
import omit from 'lodash/omit';
import { assert } from 'chai';
import { isValid } from 'shortid';
import simulate from '../../../utils/promiseApiTester';
import mongoMapper from '../../../utils/mongo-mapper';
import { tokenService } from '../../../../v1/services';

describe('User suite [create]', () => {
  const apiVersion = '/v1';
  const collectionName = 'users';
  const route = '/users';
  const omitKeys = ['access_token'];
  const omitOnConsolidate = ['updated_at', 'access_token'];

  const localStrategyInput = {
    email: 'John.Smith@gmail.com',
    password: 'mwbbziae2qlabyuhuf6eyg56qh9rdeobw6rh5lqg7yf8sr9fh0z66xe9qwzd99ir'
  };

  const twitterPassportUserData = {
    twitter_id: '3544358716',
    email: 'JohnsSmith@gmail.com',
    first_name: 'John',
    last_name: 'Smith',
    profile_img: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_3_normal.png'
  };

  const facebookPassportUserData = {
    facebook_id: '1764717173787085',
    email: 'JaneHopkins@gmail.com',
    first_name: 'Jane',
    last_name: 'Hopkins',
    profile_img: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=b1d33c3a4d6d57cbfe57dbee85ceef4b&oe=5873202F'
  };

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
  }));

  it('creates new user and asserts created [required only] - local', () => co(function* () {
    const user = yield simulate.post(apiVersion + route, localStrategyInput);

    assert.isObject(user);
    assert.isTrue(isValid(user.id));
    assert.isUndefined(user.password);
    assert.isNull(user.profile_img);
    assert.equal(user.email, localStrategyInput.email.toLocaleLowerCase(), 'Email is case sensitive');
    assert.isString(user.access_token, 'Token not assigned');

    const data = yield tokenService.validate(user.access_token);
    assert.isObject(data, 'Invalid token');

    yield mongoMapper.haveInCollection(collectionName, omit(user, omitKeys));
  }));

  it('does not query the DB for the second time for the update in case no data changed', () => co(function* () {
    const first = yield simulate.post(apiVersion + route, twitterPassportUserData);
    const second = yield simulate.post(apiVersion + route, twitterPassportUserData);

    assert.isString(second.access_token);
    assert.notEqual(first.access_token, second.access_token, 'Tokens match');
    assert.deepEqual(omit(first, 'access_token'), omit(second, 'access_token'), 'Updated at fields don\'t match');
  }));

  it('creates a new user with twitter data', () => co(function* () {
    const user = yield simulate.post(apiVersion + route, twitterPassportUserData);

    assert.isObject(user);
    assert.isTrue(isValid(user.id));
    assert.isUndefined(user.twitter_id);
    assert.isString(user.access_token, 'Token not assigned');

    yield mongoMapper.haveInCollection(collectionName, omit(user, omitKeys));
  }));

  it('creates a new user with facebook data', () => co(function* () {
    const user = yield simulate.post(apiVersion + route, facebookPassportUserData);

    assert.isObject(user);
    assert.isTrue(isValid(user.id));
    assert.isUndefined(user.facebook_id);
    assert.isString(user.access_token, 'Token not assigned');

    yield mongoMapper.haveInCollection(collectionName, omit(user, omitKeys));
  }));

  it('consolidates accounts on signup - email + facebook', () => co(function* () {
    yield simulate.post(apiVersion + route, localStrategyInput);
    const facebookUser = yield simulate.post(apiVersion + route, {
      ...facebookPassportUserData,
      email: localStrategyInput.email // same emails
    });

    assert.equal(facebookUser.email, localStrategyInput.email.toLowerCase(), 'Email changed on consolidation');
    assert.equal(facebookUser.first_name, facebookPassportUserData.first_name, 'First name was not added');
    assert.equal(facebookUser.last_name, facebookPassportUserData.last_name, 'Last name was not added');
    assert.equal(facebookUser.profile_img, facebookPassportUserData.profile_img, 'Image link was not added');

    assert.isString(facebookUser.access_token, 'Token not assigned');
    assert.isUndefined(facebookUser.password);
    assert.isUndefined(facebookUser.facebook_id);

    yield mongoMapper.haveInCollection(collectionName, { facebook_id: facebookPassportUserData.facebook_id });
  }));

  it('consolidates accounts on signup - email + twitter', () => co(function* () {
    yield simulate.post(apiVersion + route, localStrategyInput);
    const twitterUser = yield simulate.post(apiVersion + route, {
      ...twitterPassportUserData,
      email: localStrategyInput.email
    });

    assert.equal(twitterUser.email, localStrategyInput.email.toLowerCase(), 'Email changed on consolidation');
    assert.equal(twitterUser.first_name, twitterPassportUserData.first_name, 'First name was not added');
    assert.equal(twitterUser.last_name, twitterPassportUserData.last_name, 'Last name was not added');
    assert.equal(twitterUser.profile_img, twitterPassportUserData.profile_img, 'Image link was not added');

    assert.isString(twitterUser.access_token, 'Token not assigned');
    assert.isUndefined(twitterUser.password);
    assert.isUndefined(twitterUser.twitter_id);

    yield mongoMapper.haveInCollection(collectionName, { twitter_id: twitterPassportUserData.twitter_id });
  }));

  it('consolidates accounts on signup - facebook + email', () => co(function* () {
    const facebookUser = yield simulate.post(apiVersion + route, facebookPassportUserData);
    const emailUser = yield simulate.post(apiVersion + route, {
      ...localStrategyInput,
      email: facebookPassportUserData.email
    });

    assert.isUndefined(emailUser.password);
    assert.isUndefined(emailUser.facebook_id);
    assert.isAbove(new Date(emailUser.updated_at), new Date(facebookUser.updated_at), 'Password not updated');
    assert.isString(emailUser.access_token, 'Token not assigned');
    assert.notEqual(emailUser.access_token, facebookUser.access_token, 'Same tokens');

    assert.deepEqual(omit(emailUser, omitOnConsolidate), omit(facebookUser, omitOnConsolidate));

    yield mongoMapper.haveInCollection(collectionName, omit(emailUser, omitKeys));
  }));

  it('consolidates accounts on signup - twitter + email', () => co(function* () {
    const twitterUser = yield simulate.post(apiVersion + route, twitterPassportUserData);
    const emailUser = yield simulate.post(apiVersion + route, {
      ...localStrategyInput,
      email: twitterPassportUserData.email
    });

    assert.isUndefined(emailUser.password);
    assert.isUndefined(emailUser.twitter_id);
    assert.isAbove(new Date(emailUser.updated_at), new Date(twitterUser.updated_at), 'Password not updated');
    assert.isString(emailUser.access_token, 'Token not assigned');
    assert.notEqual(emailUser.access_token, twitterUser.access_token, 'Same tokens');
    assert.deepEqual(omit(emailUser, omitOnConsolidate), omit(twitterUser, omitOnConsolidate));

    yield mongoMapper.haveInCollection(collectionName, omit(emailUser, omitKeys));
  }));

  it('consolidates accounts on signup - facebook + twitter', () => co(function* () {
    const facebookUser = yield simulate.post(apiVersion + route, {
      ...facebookPassportUserData,
      last_name: undefined
    });
    const twitterUser = yield simulate.post(apiVersion + route, {
      ...twitterPassportUserData,
      email: facebookUser.email
    });

    assert.isUndefined(twitterUser.facebook_id);
    assert.isUndefined(twitterUser.twitter_id);

    assert.isAbove(new Date(twitterUser.updated_at), new Date(facebookUser.updated_at));
    assert.isString(twitterUser.access_token, 'Token not assigned');
    assert.notEqual(facebookUser.access_token, twitterUser.access_token, 'Same tokens');

    assert.deepEqual(omit(twitterUser, omitOnConsolidate), omit({
      ...facebookUser,
      last_name: twitterPassportUserData.last_name
    }, omitOnConsolidate));

    yield mongoMapper.haveInCollection(collectionName, {
      first_name: facebookPassportUserData.first_name,
      last_name: twitterPassportUserData.last_name,
      twitter_id: twitterPassportUserData.twitter_id,
      facebook_id: facebookPassportUserData.facebook_id
    });
  }));

  it('consolidates accounts on signup - twitter + email + facebook', () => co(function* () {
    const twitterUser = yield simulate.post(apiVersion + route, {
      ...twitterPassportUserData,
      last_name: undefined
    });
    yield simulate.post(apiVersion + route, {
      ...localStrategyInput,
      email: twitterPassportUserData.email
    });
    const facebookUser = yield simulate.post(apiVersion + route, {
      ...facebookPassportUserData,
      email: twitterPassportUserData.email
    });

    assert.isUndefined(facebookUser.facebook_id);
    assert.isUndefined(facebookUser.twitter_id);
    assert.isUndefined(facebookUser.password);

    assert.isString(twitterUser.access_token, 'Token not assigned');
    assert.notEqual(facebookUser.access_token, twitterUser.access_token, 'Same tokens');
    assert.isAbove(new Date(facebookUser.updated_at), new Date(twitterUser.updated_at));

    assert.deepEqual(omit(facebookUser, omitOnConsolidate), omit({
      ...twitterUser,
      last_name: facebookPassportUserData.last_name
    }, omitOnConsolidate));

    yield mongoMapper.haveInCollection(collectionName, {
      first_name: twitterPassportUserData.first_name,
      last_name: facebookPassportUserData.last_name,
      twitter_id: twitterPassportUserData.twitter_id,
      facebook_id: facebookPassportUserData.facebook_id
    });
  }));

  it('throws an validation error when creating an account with the same email', () => co(function* () {
    const user = yield simulate.post(apiVersion + route, localStrategyInput);
    assert.isTrue(isValid(user.id));

    const error = yield simulate.post(apiVersion + route, localStrategyInput, 400);
    assert.equal(error.message, 'User with this email has already been registered.');
  }));

  it('receives RequestValidationError with wrong POST params', () => co(function* () {
    const error1 = yield simulate.post(apiVersion + route, { ...localStrategyInput, email: 'asd.as@' }, 400);

    assert.isOk(error1);
    assert.equal(error1.name, 'RequestValidationError');
    assert.equal(error1.message, 'child "email" fails because ["email" must be a valid email]. Got asd.as@ (string)');

    const error2 = yield simulate.post(apiVersion + route, { ...localStrategyInput, password: 'passשasdפך' }, 400);
    assert.equal(error2.message, 'child "password" fails because ["password" needs to be a 64-character hashed user password]. Got passשasdפך (string)');

    const error3 = yield simulate.post(apiVersion + route, { ...localStrategyInput, extra: true }, 400);
    assert.equal(error3.message, '"extra" is not allowed');

    const error4 = yield simulate.post(apiVersion + route, { ...localStrategyInput, first_name: 'John', twitter_id: '123a' }, 400);
    assert.equal(error4.message, 'child "twitter_id" fails because ["twitter_id" needs to contain only digits [0-9]]. Got 123a (string)');

    const error5 = yield simulate.post(apiVersion + route, { ...localStrategyInput, twitter_id: '123' }, 400);
    assert.equal(error5.message, '"value" contains a conflict between exclusive peers [password, twitter_id, facebook_id]');
  }));
});
