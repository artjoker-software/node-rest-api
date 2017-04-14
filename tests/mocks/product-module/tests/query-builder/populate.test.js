import co from 'co';
import { assert } from 'chai';
import omit from 'lodash/omit';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import reviewsMocks from '../../reviews.json';
import simulate from '../../../../utils/promiseApiTester';

const collectionName = 'products';

describe('*populate query builder parameter', () => {
  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, productMocks);
  }));

  it('sends GET to /products?*reviews - population by query', () => co(function* () {
    const collection = yield simulate.get('/test-routes/products?*reviews');

    assert.isArray(collection);
    assert.equal(collection.length, 6);

    const mocks = productMocks.map(product => omit({
      ...product,
      reviews: reviewsMocks
        .filter(review => review.product_id === product.id)
        .map(review => omit(review, '_id'))
    }, '_id'));

    assert.deepEqual(collection, mocks);
  }));
});
