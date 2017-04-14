import co from 'co';
import { assert } from 'chai';
import { stub } from 'sinon';
import simulate from '../../utils/promiseApiTester';
import logger from '../../../lib/logger';

describe('Error sender suite', () => {
  afterEach(() => logger.error.restore());

  it('gets request validation error and logs it', () => co(function* () {
    const logStub = stub(logger, 'error');
    const error = yield simulate.get('/test-routes/middleware/error-sender/request-validation-error', 400);

    assert.equal(error.name, 'RequestValidationError');
    assert.isTrue(logStub.calledOnce);

    const loggedError = logStub.firstCall.args[0];
    assert.equal(loggedError, error.name);
  }));

  it('gets internal server error and logs it', () => co(function* () {
    const logStub = stub(logger, 'error');
    const error = yield simulate.get('/test-routes/middleware/error-sender/error-without-options', 500);

    assert.equal(error.name, 'InternalServerError');
    assert.isTrue(logStub.calledOnce);

    const loggedError = logStub.firstCall.args[0];

    assert.equal(loggedError, error.name);
  }));

  it('gets error by default scenario and logs it', () => co(function* () {
    const logStub = stub(logger, 'error');
    const error = yield simulate.get('/test-routes/middleware/error-sender/validation-error', 500);

    assert.equal(error.name, 'ValidationError');
    assert.isTrue(logStub.calledOnce);

    const loggedError = logStub.firstCall.args[0];

    assert.equal(loggedError, error.name);
  }));
});
