import co from 'co';
import { assert } from 'chai';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';

const collectionName = 'products';

describe('$sort query builder parameter', () => {
  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, productMocks);
  }));

  it('sends GET to /products?$sort=-price', () => co(function* () {
    const collection = yield simulate.get('/test-routes/products?$sort=-price');

    for (let index = 0; index < collection.length - 1; index += 1) {
      assert.isAtLeast(collection[index].price, collection[index + 1].price);
    }
  }));

  it('sends GET to /products?$sort=rating. Sort by rating ASC', () => co(function* () {
    const collection = yield simulate.get('/test-routes/products?$sort=rating');

    for (let index = 0; index < collection.length - 1; index += 1) {
      assert.isAtMost(collection[index].rating, collection[index + 1].rating);
    }
  }));
});
