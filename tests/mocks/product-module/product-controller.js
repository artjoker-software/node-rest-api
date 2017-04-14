import { number, object, string } from 'joi';
import BaseController from '../../../lib/base/baseController';
import { id } from '../../../lib/http/request-validator';
import productService from './product-service';
import { requestValidation } from '../../../lib/decorators';

const validationRules = {
  load: object().keys({
    name: string(),
    price: number(),
    rating: number()
  }),

  loadById: object().keys({ id }),

  create: object().keys({
    name: string().required(),
    price: number(),
    rating: number()
  }),

  update: object().keys({
    id,
    name: string(),
    price: number(),
    rating: number()
  }),

  remove: object().keys({ id }),

  rv: object().keys({
    numberParameter: number(),
    numberParameterRequired: number().required(),
    stringParameter: string(),
    stringParameterRequired: string().required()
  })
};

@requestValidation(validationRules)
class ProductController extends BaseController {

  * updateByName({ params, body, query }, response) {
    const product = yield this.service.updateByName(query.name, { ...params, ...body });
    return response.ok(product);
  }

  * removeAll({ query }, response) {
    yield this.service.removeAll(query);
    return response.noContent();
  }

  * loadWithReviews({ params }, response) {
    const product = yield this.service.loadWithReviews(params);
    return response.ok(product);
  }

  * loadAllWithReviews(request, response) {
    const products = yield this.service.loadAllWithReviews();
    return response.ok(products);
  }

  rv(request, response) {
    return response.noContent();
  }
}

export default new ProductController(productService);
