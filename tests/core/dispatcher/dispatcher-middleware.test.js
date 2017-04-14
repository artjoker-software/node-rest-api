import { assert } from 'chai';
import DispatcherMiddleware, { SUCCESS_DISPATCHER_MIDDLEWARE_EXECUTION } from '../../../lib/http/dispatcher/dispatcher-middleware';

describe('Dispatcher middleware suite', () => {
  const mockContext = {
    prop: 0,

    doAction(count) {
      this.prop = count;
    },

    doReturnAction(count) {
      return { count };
    }
  };

  const mockFnSimple = mockContext.doAction;
  const mockFnWithReturn = mockContext.doReturnAction;
  const mockArgs = [1];

  it('creates middleware and assert it props', () => {
    const dispatcherMiddleware = new DispatcherMiddleware(mockContext, mockFnSimple, mockArgs);

    assert.isOk(dispatcherMiddleware);

    assert.equal(dispatcherMiddleware.context, mockContext);
    assert.equal(dispatcherMiddleware.fn, mockFnSimple);
    assert.equal(dispatcherMiddleware.args, mockArgs);
  });

  it('executes dispatcher middleware and return default value', () => {
    const dispatcherMiddleware = new DispatcherMiddleware(mockContext, mockFnSimple, mockArgs);

    const middlewareExecutionResult = dispatcherMiddleware.execute();

    assert.deepEqual(middlewareExecutionResult, SUCCESS_DISPATCHER_MIDDLEWARE_EXECUTION);
  });

  it('executes dispatcher middleware and return custom value', () => {
    const dispatcherMiddleware = new DispatcherMiddleware(mockContext, mockFnWithReturn, mockArgs);

    const middlewareExecutionResult = dispatcherMiddleware.execute();

    assert.deepEqual(middlewareExecutionResult, { count: 1 });
  });
});
