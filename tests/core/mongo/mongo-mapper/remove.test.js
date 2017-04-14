import co from 'co';
import { assert } from 'chai';
import { connectionString } from '../../../../database';
import MongoMapperProvider from '../../../utils/mongo/mongo-mapper-provider';
import productMocks from '../../../mocks/product-module/products.json';

const mongoMapperProvider = new MongoMapperProvider();

describe('Removing capabilities of MongoMapper class', () => {
  const mongoMapper = mongoMapperProvider.getMongoMapper(connectionString);
  const productsCollectionName = 'products';

  beforeEach(() => co(function* () {
    yield mongoMapper.remove(productsCollectionName);
    yield mongoMapper.insert(productsCollectionName, productMocks);
  }));

  it('removes all products', () => co(function* () {
    const products = yield mongoMapper.find(productsCollectionName);

    assert.equal(products.length, 6);

    yield mongoMapper.remove(productsCollectionName);

    const deleted = yield mongoMapper.find(productsCollectionName);

    assert.equal(deleted.length, 0);
  }));

  it('drops the database', () => co(function* () {
    const products = yield mongoMapper.find(productsCollectionName);
    assert.equal(products.length, 6);

    const result = yield mongoMapper.drop();
    assert.isTrue(result);

    const deleted = yield mongoMapper.find(productsCollectionName);
    assert.equal(deleted.length, 0);
  }));

  it('removes specified item', () => co(function* () {
    const products = yield mongoMapper.find(productsCollectionName, { name: 'Apple Watch' });

    assert.equal(products.length, 1);

    yield mongoMapper.remove(productsCollectionName);

    const deleted = yield mongoMapper.find(productsCollectionName, { name: 'Apple Watch' });

    assert.equal(deleted.length, 0);

    // Should remember about identitycounters collection!
  }));
});
