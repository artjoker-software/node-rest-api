import co from 'co';
import { assert } from 'chai';
import { connectionString } from '../../../../database';
import MongoMapperProvider from '../../../utils/mongo/mongo-mapper-provider';
import productMocks from '../../../mocks/product-module/products.json';

const mongoMapperProvider = new MongoMapperProvider();

describe('Creation capabilities of MongoMapper class', () => {
  const mongoMapper = mongoMapperProvider.getMongoMapper(connectionString);
  const productsCollectionName = 'products';
  const iPad = {
    name: 'iPad',
    price: 959
  };

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(productsCollectionName);
  }));

  it('inserts one document in product collection', () => co(function* () {
    yield mongoMapper.insert(productsCollectionName, iPad);

    const [product] = yield mongoMapper.find(productsCollectionName, { name: 'iPad' });

    assert.equal(product.name, iPad.name);
  }));

  it('inserts many documents in product collection', () => co(function* () {
    yield mongoMapper.insert(productsCollectionName, productMocks);

    const products = yield mongoMapper.find(productsCollectionName);

    assert.equal(products.length, productMocks.length);
  }));
});
