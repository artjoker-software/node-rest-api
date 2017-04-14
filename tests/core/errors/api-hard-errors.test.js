import { assert } from 'chai';
import { stub } from 'sinon';
import proxyquire from 'proxyquire';
import logger from '../../../lib/logger';

describe('API hard to cause error suite', () => {
  it('throws an error if no API port supplied', () => {
    const loggerStub = stub(logger, 'error');

    proxyquire('../../../api', { './config': { apiPort: null } });

    assert.isTrue(loggerStub.calledOnce);

    const error = loggerStub.firstCall.args[0];
    assert.equal(error.message, 'ERROR: No PORT environment variable has been specified');

    logger.error.restore();
  });

  it('logs an error on app.listen', () => {
    const loggerStub = stub(logger, 'error');
    assert.isFalse(loggerStub.called);

    proxyquire('../../../api', {
      express: () => ({
        use: () => {},
        listen: (apiPort, callback) => callback(new Error('Mock error'))
      })
    });

    assert.isTrue(loggerStub.calledOnce);
    const error = loggerStub.firstCall.args[0];

    assert.equal(error.message, 'Mock error');

    logger.error.restore();
  });
});
