import omit from 'lodash/omit';
import productDAO from './product-dao';

class ProductService {

  productDAO;

  constructor(dao) {
    this.productDAO = dao;
  }

  load(params = {}) {
    return this.productDAO.load(params);
  }

  loadById(id) {
    return this.productDAO.loadById(id);
  }

  create(productData) {
    return this.productDAO.create(productData);
  }

  update(productData) {
    return this.productDAO.update(productData);
  }

  updateByName(name, productData) {
    const data = omit(productData, 'id');
    return this.productDAO.updateBy({ by: { name }, ...data });
  }

  remove(id) {
    return this.productDAO.remove(id);
  }

  removeAll({ disableCache }) {
    return this.productDAO.removeAll(disableCache);
  }

  loadWithReviews(params) {
    return this.productDAO.populate(params, 'reviews');
  }

  loadAllWithReviews() {
    return this.productDAO.populateAll({}, 'reviews');
  }

}

export default new ProductService(productDAO);
