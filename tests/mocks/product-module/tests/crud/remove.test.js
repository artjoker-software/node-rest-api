import co from 'co';
import mongoMapper from '../../../../utils/mongo-mapper';
import productMocks from '../../products.json';
import simulate from '../../../../utils/promiseApiTester';

const collectionName = 'products';

describe('Products suite delete', () => {
  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(collectionName);
    yield mongoMapper.insert(collectionName, productMocks);
  }));

  it('sends DELETE to /products/:id', () => co(function* () {
    const mock = productMocks[0];

    yield mongoMapper.haveInCollection(collectionName, mock);
    yield simulate.delete(`/test-routes/products/${mock.id}`);
    yield mongoMapper.dontHaveInCollection(collectionName, mock);
  }));

  it('sends DELETE to /products', () => co(function* () {
    yield mongoMapper.haveInCollection(collectionName, productMocks);
    yield simulate.delete('/test-routes/products');
    yield mongoMapper.dontHaveInCollection(collectionName, productMocks);
  }));

  it('sends DELETE to /products. Without cache. Checks batch deletions', () => co(function* () {
    yield mongoMapper.haveInCollection(collectionName, productMocks);
    yield simulate.delete('/test-routes/products?disableCache=true');
    yield mongoMapper.dontHaveInCollection(collectionName, productMocks);
  }));
});
