import co from 'co';
import { assert } from 'chai';
import simulate from '../../../utils/promiseApiTester';
import mongoMapper from '../../../utils/mongo-mapper';
import userResponses from '../../../../docs/mocks/users-mock.json';
import { generateMockUsers } from '../../../utils/generateMockUsers';

describe('User suite [load]', () => {
  const apiVersion = '/v1';
  const collectionName = 'users';
  const route = '/users';
  let users = null;

  before(() => co(function* () {
    users = yield generateMockUsers();
  }));

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, users);
  }));

  it('loads all users', () => co(function* () {
    const allUsers = yield simulate.get(apiVersion + route, 200);
    // Check user date sort
    const mocks = userResponses
      .sort((one, two) => (new Date(two.created_at) - new Date(one.created_at)));

    assert.equal(allUsers.length, mocks.length);
    assert.deepEqual(allUsers, mocks);
  }));

  it('checks $sort param', () => co(function* () {
    const allUsers = yield simulate.get(`${apiVersion + route}?$sort=updated_at`, 200);
    const mocks = userResponses
      .sort((one, two) => (new Date(one.updated_at) - new Date(two.updated_at)));

    assert.deepEqual(allUsers, mocks);
  }));

  it('receives RequestValidationError with wrong POST params', () => co(function* () {
    const error = yield simulate.get(`${apiVersion + route}?extra=true`, 400);
    assert.equal(error.message, '"extra" is not allowed');
  }));
});
