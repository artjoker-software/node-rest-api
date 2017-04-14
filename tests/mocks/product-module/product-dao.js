import BaseDAO from '../../../lib/base/baseDAO';
import Product from './Product';

class ProductDAO extends BaseDAO {

  cache = { cache: true, time: 500 };

  removeAll(disableCache = false) {
    if (disableCache) {
      this.cache.cache = false;
      this.load(); // trigger isCacheEnabled change
    }

    const result = super.removeAll();

    if (disableCache) {
      this.cache.cache = true;
      this.load(); // trigger isCacheEnabled change
    }

    return result;
  }

}

export default new ProductDAO(Product);
