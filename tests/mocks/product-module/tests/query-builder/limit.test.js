import co from 'co';
import { assert } from 'chai';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';

const collectionName = 'products';

describe('$limit query builder parameter', () => {
  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, productMocks);
  }));

  it('sends GET to /products?$limit=5. It receives only 5 records', () => co(function* () {
    const collection = yield simulate.get('/test-routes/products?$limit=5');
    assert.equal(collection.length, 5);
  }));

  it('sends GET to /products?$limit=wrong. It skips wrong $limit parameter', () => co(function* () {
    const collection = yield simulate.get('/test-routes/products?$limit=wrong');
    assert.equal(collection.length, 6);
  }));
});
