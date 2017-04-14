import co from 'co';
import { assert } from 'chai';
import { connectionString } from '../../../../database';
import MongoMapperProvider from '../../../utils/mongo/mongo-mapper-provider';
import productMocks from '../../../mocks/product-module/products.json';

// MongoClient.connect
const mongoMapperProvider = new MongoMapperProvider();

describe('Query capabilities of MongoMapper class', () => {
  const mongoMapper = mongoMapperProvider.getMongoMapper(connectionString);
  const productsCollectionName = 'products';

  beforeEach(() => co(function* () {
    yield mongoMapper.remove(productsCollectionName);
    yield mongoMapper.insert(productsCollectionName, productMocks);
  }));

  it('tests is query is Array', () => co(function* () {
    const products = yield mongoMapper.find(productsCollectionName);

    assert.isArray(products);
    assert.equal(products.length, 6);
  }));


  it('loads test product by name', () => co(function* () {
    const watchParams = { name: 'Apple Watch' };
    const [watch] = yield mongoMapper.find(productsCollectionName, watchParams);

    assert.equal(watch.name, watchParams.name);
  }));

  it('doesn\'t load anything', () => co(function* () {
    const wrongParams = { some: 'lame-paramter' };
    const products = yield mongoMapper.find(productsCollectionName, wrongParams);

    assert.equal(products.length, 0);
  }));

  it('find one document', () => co(function* () {
    const watchParams = { name: 'Apple Watch' };
    const watch = yield mongoMapper.findOne(productsCollectionName, watchParams);

    assert.equal(watch.name, watchParams.name);
  }));
});
