import addRoute from './addRoute';

export default router => (routes) => {
  routes.forEach(
    ({ route, method, controller, action, options }) => addRoute(router, route, method, controller, action, options)
  );
  return router;
};
