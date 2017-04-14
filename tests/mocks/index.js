import { Router as routerFactory } from 'express';
import middlewareTestRoutes from './middleware/routes';
import productTestRoutes from './product-module/product-routes';

const testRoutesRouter = routerFactory();

testRoutesRouter.use('/middleware', middlewareTestRoutes);
testRoutesRouter.use('/products', productTestRoutes);

export default testRoutesRouter;
