import { assert } from 'chai';
import { routeConfigFactory } from '../../../utils/http';
import { HTTP_METHODS } from '../../../utils/http/routeConfigFactory';

describe('Route config factory util', () => {
  const mockController = {
    someAction() {
      return 1;
    }
  };

  const mockAction = mockController.someAction;
  const mockRoute = '/some/route';

  it('route config factory base test', () => {
    const routeConfig = routeConfigFactory.get(mockRoute, mockController, mockAction);

    assert.isObject(routeConfig);
    assert.equal(routeConfig.route, mockRoute);
    assert.equal(routeConfig.controller, mockController);
    assert.equal(routeConfig.action, mockAction);
  });

  it('route config factory GET test', () => {
    const routeConfig = routeConfigFactory.get(mockRoute, mockController, mockRoute);

    assert.equal(routeConfig.method, HTTP_METHODS.GET);
  });

  it('route config factory POST test', () => {
    const routeConfig = routeConfigFactory.post(mockRoute, mockController, mockRoute);

    assert.equal(routeConfig.method, HTTP_METHODS.POST);
  });

  it('route config factory PUT test', () => {
    const routeConfig = routeConfigFactory.put(mockRoute, mockController, mockRoute);

    assert.equal(routeConfig.method, HTTP_METHODS.PUT);
  });


  it('route config factory DELETE test', () => {
    const routeConfig = routeConfigFactory.delete(mockRoute, mockController, mockRoute);

    assert.equal(routeConfig.method, HTTP_METHODS.DELETE);
  });
});
