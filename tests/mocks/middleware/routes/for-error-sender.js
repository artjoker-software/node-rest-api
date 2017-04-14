import { Router as routerConstructor } from 'express';
import { addRoutes, routeConfigFactory } from '../../../../utils/http';
import { errorSenderTestController } from '../controllers';

const router = routerConstructor();

export default addRoutes(router)([
  routeConfigFactory.get('/error-without-options', errorSenderTestController, errorSenderTestController.throwErrorWithoutOptions),

  routeConfigFactory.get('/request-validation-error', errorSenderTestController, errorSenderTestController.throwRequestValidationError),

  routeConfigFactory.get('/validation-error', errorSenderTestController, errorSenderTestController.throwValidationError)
]);
