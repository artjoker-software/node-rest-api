import co from 'co';
import apiFilter from '../api-filter';
import DispatcherMiddleware from './dispatcher-middleware';

class Dispatcher {

  _apiFilter;

  constructor(filter) {
    this.apiFilter = filter;
  }

  dispatch({ request, response, next }, { controller, controllerAction, options }) {
    return co(function* () {
      const middleware = [
        new DispatcherMiddleware(this.apiFilter, this.apiFilter.filter, [request, controller, controllerAction, options]),
        new DispatcherMiddleware(controller, controllerAction, [request, response, next, options])
      ];

      for (const mw of middleware) {
        yield mw.execute();
      }
    }
      .bind(this))
      .catch(next);
  }

  set apiFilter(filter) {
    this._apiFilter = filter;
  }

  get apiFilter() {
    return this._apiFilter;
  }

}

export default new Dispatcher(apiFilter);
