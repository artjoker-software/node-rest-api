import co from 'co';
import { assert } from 'chai';
import omit from 'lodash/omit';
import inMemoryCache from 'memory-cache';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import reviewsMocks from '../../reviews.json';
import simulate from '../../../../utils/promiseApiTester';

const productsCollectionName = 'products';
const reviewsCollectionName = 'reviews';

describe('Products suite populate', () => {
  beforeEach(() => co(function* () {
    inMemoryCache.clear();

    yield mongoMapper.clearCollections([productsCollectionName, reviewsCollectionName]);

    yield mongoMapper.insert(productsCollectionName, productMocks);
    yield mongoMapper.insert(reviewsCollectionName, reviewsMocks);
  }));

  it('sends GET to /products/:id/reviews', () => co(function* () {
    const id = productMocks[0].id;
    const body = yield simulate.get(`/test-routes/products/${id}/reviews`);

    assert.isObject(body);
    assert.deepEqual(omit(productMocks[0], '_id'), omit(body, 'reviews'));

    const { reviews } = body;

    assert.isArray(reviews);

    const mocks = reviewsMocks
      .filter(mock => mock.product_id === productMocks[0].id)
      .map(mock => omit(mock, '_id'));

    assert.deepEqual(reviews, mocks);
  }));

  it('sends GET to /products/reviews', () => co(function* () {
    const products = yield simulate.get('/test-routes/products/reviews');

    assert.isArray(products);
    assert.equal(products.length, productMocks.length);

    const mocks = productMocks
      .map(mock =>
        omit({
          ...mock,
          reviews: reviewsMocks
            .filter(review => review.product_id === mock.id)
            .map(review => omit(review, '_id'))
        }, '_id')
      );

    assert.deepEqual(products, mocks);
  }));
});
