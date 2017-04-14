import co from 'co';
import dispatcher from '../../../lib/http/dispatcher';

const requestMock = {};
const responseMock = {};
const nextMock = () => ({});
const ctrlMock = {
  someAction() {
    return true;
  }
};
const controllerAction = ctrlMock.someAction;
const optionsMock = {};

describe('Dispatcher suite', () => {
  it('executes dispatching', () => co(function* () {
    const flowContext = {
      request: requestMock,
      response: responseMock,
      next: nextMock
    };
    const controllerContext = {
      controller: ctrlMock,
      controllerAction,
      options: optionsMock
    };

    yield dispatcher.dispatch(flowContext, controllerContext);
  }));
});
