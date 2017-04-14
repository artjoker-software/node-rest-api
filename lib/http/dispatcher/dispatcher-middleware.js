export const SUCCESS_DISPATCHER_MIDDLEWARE_EXECUTION = { success: true };

class DispatcherMiddleware {
  _context;
  _fn;
  _args;

  constructor(context, fn, args) {
    this.context = context;
    this.fn = fn;
    this.args = args;
  }

  execute() {
    return this.fn.apply(this.context, this.args) || SUCCESS_DISPATCHER_MIDDLEWARE_EXECUTION;
  }

  set context(value) {
    this._context = value;
  }

  get context() {
    return this._context;
  }

  set fn(fn) {
    this._fn = fn;
  }

  get fn() {
    return this._fn;
  }

  set args(value) {
    this._args = value;
  }

  get args() {
    return this._args;
  }

}

export default DispatcherMiddleware;
