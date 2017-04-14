import co from 'co';
import { assert } from 'chai';
import mongoMapper from '../../../utils/mongo-mapper';
import productMocks from '../../../mocks/product-module/products.json';

describe('Don\'t have in collection method', () => {
  const productsCollectionName = 'products';

  beforeEach(() => co(function* () {
    yield mongoMapper.clearCollection(productsCollectionName);
    yield mongoMapper.insert(productsCollectionName, productMocks);
  }));

  it('checks is mock data doesn\'t exists in db', () => co(function* () {
    yield mongoMapper.dontHaveInCollection(productsCollectionName, { name: 'Mackbook Pro' });
  }));

  it('throws if data is in db [single object only]', () => co(function* () {
    try {
      yield mongoMapper.dontHaveInCollection(productsCollectionName, productMocks[0]);
      throw new Error('Should not execute');
    } catch (err) {
      assert.equal(err.message, 'Found the document: expected 1 to equal 0');
    }
  }));

  it('throws if data is in db [array]', () => co(function* () {
    try {
      yield mongoMapper.dontHaveInCollection(productsCollectionName, productMocks);
      throw new Error('Should not execute');
    } catch (err) {
      assert.equal(err.message, 'Found the document: expected 1 to equal 0');
    }
  }));
});
