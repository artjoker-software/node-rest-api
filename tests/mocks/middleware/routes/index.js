import { Router as routerFactory } from 'express';
import errorTestRoutes from './for-errors';
import requestLoggerTestRoutes from './for-request-logger';
import errorSenderTestRoutes from './for-error-sender';

const middlewareTestRoutesRouter = routerFactory();

middlewareTestRoutesRouter.use('/error', errorTestRoutes);
middlewareTestRoutesRouter.use('/request-logger', requestLoggerTestRoutes);
middlewareTestRoutesRouter.use('/error-sender', errorSenderTestRoutes);

export default middlewareTestRoutesRouter;
