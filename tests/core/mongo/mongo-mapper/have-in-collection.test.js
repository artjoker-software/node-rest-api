import co from 'co';
import { assert } from 'chai';
import mongoMapper from '../../../utils/mongo-mapper';
import productMocks from '../../../mocks/product-module/products.json';

describe('Have in collection method', () => {
  const productsCollectionName = 'products';

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(productsCollectionName);
    yield mongoMapper.insert(productsCollectionName, productMocks);
  }));

  it('checks is mock data exists in db [array]', () => co(function* () {
    yield mongoMapper.haveInCollection(productsCollectionName, productMocks);
  }));

  it('checks is mock data exists in db [single object]', () => co(function* () {
    yield mongoMapper.haveInCollection(productsCollectionName, productMocks[0]);
    yield mongoMapper.haveInCollection(productsCollectionName, productMocks[3]);
  }));

  it('throws if data is not in db [array]', () => co(function* () {
    try {
      yield mongoMapper.haveInCollection(productsCollectionName, [{ name: 'Product_1' }, { name: 'Product_2' }]);
      throw new Error('Should not execute');
    } catch (err) {
      assert.equal(err.message, 'couldn\'t find the object: expected null to be truthy');
    }
  }));

  it('throws if data is not in db [single object]', () => co(function* () {
    try {
      yield mongoMapper.haveInCollection(productsCollectionName, { name: 'Product_1' });
      throw new Error('Should not execute');
    } catch (err) {
      assert.equal(err.message, 'couldn\'t find the object: expected null to be truthy');
    }
  }));
});
