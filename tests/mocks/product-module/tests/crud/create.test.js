import co from 'co';
import { assert } from 'chai';
import omit from 'lodash/omit';
import mongoMapper from '../../../../utils/mongo-mapper';
import simulate from '../../../../utils/promiseApiTester';
import { generateMockUsers, generateUserTokens, getUnassignedToken } from '../../../../utils/generateMockUsers';

const collectionName = 'products';

describe('Products suite create', () => {
  const omitParams = ['created_at', 'updated_at', 'reviews'];
  const tokens = {
    admin: null,
    user: null,
    unassigned: null
  };
  let users = null;

  const createProductParams = {
    name: 'Mac mini',
    price: 900,
    rating: 50
  };

  const createProductParamsWithDefaults = {
    name: 'Mac pen'
  };

  before(() => co(function* () {
    users = yield generateMockUsers();
    const userTokens = yield generateUserTokens(true);
    tokens.admin = userTokens[0];
    tokens.user = userTokens[1];
    tokens.unassigned = yield getUnassignedToken();
  }));

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollections(['users', collectionName]);
    yield mongoMapper.insert('users', users);
  }));


  it('sends POST to /product without default options', () => co(function* () {
    const data = yield simulate.post('/test-routes/products', createProductParams, 200, tokens.user);

    assert.isObject(data);

    assert.equal(data.name, createProductParams.name);
    assert.equal(data.price, createProductParams.price);
    assert.equal(data.rating, createProductParams.rating);

    assert.isString(data.id);
    assert.isUndefined(data._id);

    yield mongoMapper.haveInCollection(collectionName, omit(data, ...omitParams));
  }));

  it('sends POST to /product with default options', () => co(function* () {
    const data = yield simulate.post('/test-routes/products', createProductParamsWithDefaults, 200, tokens.user);

    assert.equal(data.name, createProductParamsWithDefaults.name);
    assert.equal(data.price, 0);
    assert.equal(data.rating, 0);

    assert.isString(data.id);
    assert.isUndefined(data._id);

    yield mongoMapper.haveInCollection(collectionName, omit(data, ...omitParams));
  }));

  it('recieves RequestValidationError on wrong POST params', () => co(function* () {
    const error = yield simulate.post('/test-routes/products', {}, 400, tokens.user);

    assert.deepEqual(error.message, 'child "name" fails because ["name" is required]');
  }));

  it('ensures token access hierarchy', () => co(function* () {
    yield simulate.post('/test-routes/products', createProductParamsWithDefaults, 200, tokens.admin);
  }));
});
