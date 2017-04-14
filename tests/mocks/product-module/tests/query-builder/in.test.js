import co from 'co';
import { assert } from 'chai';
import omit from 'lodash/omit';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';

const collectionName = 'products';

describe('$in query builder parameter', () => {
  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, productMocks);
  }));

  it('sends GET to /products?id=:id1,:id3,:id6. It receives 3 corresponding documents', () => co(function* () {
    const sortedMocks = productMocks.sort((item1, item2) => item1.price > item2.price);
    const [m1, , m3, , , m6] = sortedMocks.map(product => omit(product, '_id'));
    const idQuery = `id=${m1.id},${m6.id},${m3.id},${m1.id}`;

    const collection = yield simulate.get(`/test-routes/products?${idQuery}&$sort=price`);

    assert.equal(collection.length, 3);

    const [first, third, sixth] = collection.map(item => omit(item, 'reviews'));

    assert.deepEqual(first, m1);
    assert.deepEqual(third, m3);
    assert.deepEqual(sixth, m6);
  }));
});
