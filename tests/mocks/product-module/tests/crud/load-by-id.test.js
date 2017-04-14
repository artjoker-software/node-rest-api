import co from 'co';
import { assert } from 'chai';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';
import { generateMockUsers, generateUserTokens } from '../../../../utils/generateMockUsers';

const collectionName = 'products';

describe('Products suite load by id', () => {
  const route = '/test-routes/products/';
  const tokens = {
    admin: null,
    user: null
  };
  let users = null;

  before(() => co(function* () {
    users = yield generateMockUsers();
    const userTokens = yield generateUserTokens(true);
    tokens.admin = userTokens[0];
    tokens.user = userTokens[1];
  }));

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollections(['users', collectionName]);
    yield mongoMapper.insert(collectionName, productMocks);
    yield mongoMapper.insert('users', users);
  }));

  it('sends GET to /products/:id', () => co(function* () {
    const id = productMocks[0].id;
    const shouldBe = {
      _id: undefined,
      ...productMocks.find(product => product.id === id),
      reviews: null
    };
    delete shouldBe._id;

    const data = yield simulate.get(`${route}/${id}`, 200, tokens.admin);

    assert.deepEqual(data, shouldBe);
  }));

  it('sends GET to /products/10004', () => co(function* () {
    const error = yield simulate.get(`${route}/10004`, 400);
    assert.equal(error.name, 'RequestValidationError');
    assert.equal(error.message, 'child "id" fails because ["id" needs to be a valid short id string]. Got 10004 (string)');
  }));
});
