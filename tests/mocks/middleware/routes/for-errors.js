import { Router as routerConstructor } from 'express';
import { addRoutes, routeConfigFactory } from '../../../../utils/http';
import { errorsTestController } from '../controllers';

const router = routerConstructor();

export default addRoutes(router)([
  routeConfigFactory.get('/bad-request', errorsTestController, errorsTestController.throwBadRequestError),

  routeConfigFactory.get('/authentication', errorsTestController, errorsTestController.throwAuthenticationError),

  routeConfigFactory.get('/authorisation', errorsTestController, errorsTestController.throwAuthorisationError),

  routeConfigFactory.get('/internal-server', errorsTestController, errorsTestController.throwInternalServerError),

  routeConfigFactory.get('/not-found', errorsTestController, errorsTestController.throwNotFoundError)
]);
