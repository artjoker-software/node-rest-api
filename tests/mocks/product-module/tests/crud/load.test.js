import co from 'co';
import { assert } from 'chai';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';

const collectionName = 'products';

describe('Products suite load', () => {
  const route = '/test-routes/products';

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, productMocks);
  }));

  it('sends GET to /products', () => co(function* () {
    const collection = yield simulate.get(route, 200);

    assert.isArray(collection);
    assert.equal(collection.length > 0, true);
  }));

  it('sends GET to /products?price=400', () => co(function* () {
    const collection = yield simulate.get(`${route}?price=400`, 200);

    assert.isArray(collection);
    assert.equal(collection.length, 1);

    delete productMocks[5]._id;
    delete collection[0].reviews; // Virtual field

    assert.deepEqual(collection[0], productMocks[5]);
  }));
});
