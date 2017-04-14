import dispatcher from '../../lib/http/dispatcher';

export default
    (router, route, method, controller, controllerAction, options) =>
         router[method](route, (request, response, next) =>
             dispatcher.dispatch({ request, response, next }, { controller, controllerAction, options }));
