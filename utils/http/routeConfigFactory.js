export const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
};

export default {
  get: (route, controller, action) => ({ method: HTTP_METHODS.GET, route, controller, action }),

  post: (route, controller, action) => ({ method: HTTP_METHODS.POST, route, controller, action }),

  put: (route, controller, action) => ({ method: HTTP_METHODS.PUT, route, controller, action }),

  delete: (route, controller, action) => ({ method: HTTP_METHODS.DELETE, route, controller, action })
};
