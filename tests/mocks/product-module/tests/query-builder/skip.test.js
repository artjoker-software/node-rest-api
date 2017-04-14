import co from 'co';
import { assert } from 'chai';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';

const collectionName = 'products';

describe('$skip query builder parameter', () => {
  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, productMocks);
  }));

  it('sends GET to /products?$skip=3. Skips three records', () => co(function* () {
    const collection = yield simulate.get('/test-routes/products?$skip=3');
    assert.equal(collection.length, 3);
  }));

  it('sends GET to /products?$skip=wrong. Skip wrong $skip parameter', () => co(function* () {
    const collection = yield simulate.get('/test-routes/products?$skip=wrong');
    assert.equal(collection.length, 6);
  }));
});
