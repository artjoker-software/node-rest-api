import co from 'co';
import { assert } from 'chai';
import omit from 'lodash/omit';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';
import { generateMockUsers, generateUserTokens } from '../../../../utils/generateMockUsers';

const collectionName = 'products';

describe('Products suite update', () => {
  const route = `/test-routes/products/${productMocks[0].id}`;
  const omitParams = ['created_at', 'updated_at', 'reviews'];
  const tokens = {
    admin: null,
    user: null,
    invalid: null
  };
  let users = null;

  const updateProductName = {
    name: 'iPhone 7SE'
  };

  const updateProductPrice = {
    price: 1000
  };

  const updateProductNameAndPrice = {
    name: 'iPhone 7SE',
    price: 1000
  };

  before(() => co(function* () {
    users = yield generateMockUsers();
    const userTokens = yield generateUserTokens(true);
    tokens.admin = userTokens[0];
    tokens.user = userTokens[1];
    tokens.invalid = 'this.isa.token';
  }));

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollections(['users', collectionName]);
    yield mongoMapper.insert(collectionName, productMocks);
    yield mongoMapper.insert('users', users);
  }));

  it('sends PUT to /product/:id and updates name', () => co(function* () {
    const data = yield simulate.put(route, updateProductName, 200, tokens.admin);

    assert.isObject(data);

    assert.equal(data.name, updateProductName.name);
    assert.equal(data.price, data.price, 'assert that price wasn\'t changed');

    yield mongoMapper.haveInCollection(collectionName, omit(data, ...omitParams));
  }));

  it('sends PUT to /product/:id/name and updates by name', () => co(function* () {
    const data = yield simulate.put(`${route}/name?name=iPhone 6SE`, updateProductName, 200, tokens.admin);

    assert.isObject(data);

    assert.equal(data.name, updateProductName.name);
    assert.equal(data.price, data.price, 'assert that price wasn\'t changed');

    yield mongoMapper.haveInCollection(collectionName, omit(data, ...omitParams));
  }));

  it('sends PUT to /product/:id and updates price', () => co(function* () {
    const data = yield simulate.put(route, updateProductPrice, 200, tokens.admin);

    assert.isObject(data);

    assert.equal(data.price, updateProductPrice.price);
    assert.equal(data.name, data.name, 'assert that name wasn\'t changed');

    yield mongoMapper.haveInCollection(collectionName, omit(data, ...omitParams));
  }));

  it('sends PUT to /product/:id and updates name and price', () => co(function* () {
    const data = yield simulate.put(route, updateProductNameAndPrice, 200, tokens.admin);

    assert.isObject(data);

    assert.equal(data.name, updateProductNameAndPrice.name);
    assert.equal(data.price, updateProductNameAndPrice.price);

    yield mongoMapper.haveInCollection(collectionName, omit(data, ...omitParams));
  }));
});
