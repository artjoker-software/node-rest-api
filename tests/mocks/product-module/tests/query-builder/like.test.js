import co from 'co';
import { assert } from 'chai';
import omit from 'lodash/omit';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';

const collectionName = 'products';

describe('$like query builder parameter', () => {
  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, productMocks);
  }));

  it('sends GET to /products?$sort=price&$like=(name|Pro). It receives 2 corresponding documents by mask', () => co(function* () {
    const collection = yield simulate.get('/test-routes/products?$sort=price&$like=(name|Pro)');

    assert.equal(collection.length, 2);

    const formattedCollection = collection.map(item => omit(item, 'reviews'));

    const sortedMocks =
      productMocks
        .sort((item1, item2) => item1.price > item2.price)
        .map(item => omit(item, '_id'))
        .filter(item => item.name.indexOf('Pro') !== -1);

    assert.deepEqual(formattedCollection, sortedMocks);
  }));
});
