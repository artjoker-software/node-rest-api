import co from 'co';
import { assert } from 'chai';
import { stub } from 'sinon';
import simulate from '../../utils/promiseApiTester';
import logger from '../../../lib/logger';
import { requestLogger } from '../../../middleware';

describe('Request logger suite', () => {
  const requestLoggerMiddlewareArgs = [
    {
      params: {
        id: 1
      },
      url: 'mock url',
      method: 'mock method'
    },
    {},
    () => ({})
  ];

  afterEach(() => logger.info.restore());

  it('covers query string params and logs it', () => co(function* () {
    const logStub = stub(logger, 'info');
    yield simulate.get('/test-routes/middleware/request-logger/request-params-query?param=1');

    assert.isTrue(logStub.calledOnce);

    const loggedInfo = logStub.firstCall.args[0];
    const shouldEqual = 'GET /test-routes/middleware/request-logger/request-params-query?param=1\n==> Have query parameters:\n{"param":"1"}\n';

    assert.equal(loggedInfo, shouldEqual);
  }));

  it('covers POST body params and logs it', () => co(function* () {
    const logStub = stub(logger, 'info');
    yield simulate.post('/test-routes/middleware/request-logger/request-body-test', { name: 'John' });

    assert.isTrue(logStub.calledOnce);

    const loggedInfo = logStub.firstCall.args[0];
    const shouldEqual = 'POST /test-routes/middleware/request-logger/request-body-test\n==> Have body parameters:\n{"name":"John"}\n';

    assert.equal(loggedInfo, shouldEqual);
  }));

  it('covers URI params and logs it', () => co(function* () {
    const logStub = stub(logger, 'info');
    yield simulate.get('/test-routes/middleware/request-logger/request-params-test/1');

    assert.isTrue(logStub.calledOnce);

    const loggedInfo = logStub.firstCall.args[0];
    const shouldEqual = 'GET /test-routes/middleware/request-logger/request-params-test/1\n';

    assert.equal(loggedInfo, shouldEqual);
  }));

  it('checks URI params in force', () => {
    const logStub = stub(logger, 'info');
    requestLogger(...requestLoggerMiddlewareArgs);

    assert.isTrue(logStub.calledOnce);
    const loggedInfo = logStub.firstCall.args[0];
    const shouldEqual = 'mock method mock url\n==> Have URI parameters:\n{"id":1}\n';

    assert.equal(loggedInfo, shouldEqual);
  });
});
