import { Router as routerConstructor } from 'express';
import { addRoutes, routeConfigFactory as Route } from '../../../../utils/http';
import { requestLoggerTestController } from '../controllers';

const router = routerConstructor();

export default addRoutes(router)([
  Route.post('/request-body-test', requestLoggerTestController, requestLoggerTestController.requestBodyTest),

  Route.get('/request-params-test/:value', requestLoggerTestController, requestLoggerTestController.requestParamsTest),

  Route.get('/request-params-query', requestLoggerTestController, requestLoggerTestController.requestQueryTest)
]);
