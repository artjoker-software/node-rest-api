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

  it('clears all collections', () => co(function* () {
    yield mongoMapper.clearCollection(productsCollectionName);

    const deleted = yield mongoMapper.find(productsCollectionName);

    assert.equal(deleted.length, 0);
  }));

  it('clears one collection', () => co(function* () {
    yield mongoMapper.clearCollection(productsCollectionName);

    const deleted = yield mongoMapper.find(productsCollectionName);

    assert.equal(deleted.length, 0);
  }));
});
