import co from 'co';
import { assert } from 'chai';
import { connectionString } from '../../../../database';
import MongoMapperProvider from '../../../utils/mongo/mongo-mapper-provider';
import productMocks from '../../../mocks/product-module/products.json';

const mongoMapperProvider = new MongoMapperProvider();

describe('Update capabilities of MongoMapper class', () => {
  const mongoMapper = mongoMapperProvider.getMongoMapper(connectionString);
  const productsCollectionName = 'products';

  const replacement = {
    name: 'Apple Watch',
    price: 999
  };

  beforeEach(() => co(function* () {
    yield mongoMapper.remove(productsCollectionName);
    yield mongoMapper.insert(productsCollectionName, productMocks);
  }));

  it('update one record', () => co(function* () {
    const product = yield mongoMapper.update(productsCollectionName, { name: productMocks[0].name }, replacement);

    assert.isObject(product);

    assert.equal(product.name, replacement.name);
    assert.equal(product.price, replacement.price);

    const updatedProduct = yield mongoMapper.findOne(productsCollectionName, { id: productMocks[0].id });

    assert.deepEqual(product, updatedProduct);
  }));
});
