import { Router as routerFactory } from 'express';
import { addRoutes, routeConfigFactory as Route } from '../../../utils/http';
import productController from './product-controller';

const router = routerFactory();

export default addRoutes(router)([
  Route.get('/', productController, productController.load),

  Route.get('/reviews', productController, productController.loadAllWithReviews),

  Route.get('/request-validation', productController, productController.rv),

  Route.get('/:id', productController, productController.loadById),

  Route.get('/:id/reviews', productController, productController.loadWithReviews),

  Route.post('/', productController, productController.create),

  Route.put('/:id', productController, productController.update),

  Route.put('/:id/name', productController, productController.updateByName),

  Route.delete('/', productController, productController.removeAll),

  Route.delete('/:id', productController, productController.remove)

]);
