import { Router as routerFactory } from 'express';
import { addRoutes, routeConfigFactory as Route } from '../../utils/http';
import { usersController } from '../controllers';

const router = routerFactory();

export default addRoutes(router)([
  Route.get('/', usersController, usersController.load),
  Route.post('/', usersController, usersController.create)
]);
