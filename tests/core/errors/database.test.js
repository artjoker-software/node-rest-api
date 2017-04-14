import mongoose from 'mongoose';
import { assert } from 'chai';
import { stub } from 'sinon';
import logger from '../../../lib/logger';

describe('Mongo connection suite', () => {
  after(() => {
    mongoose.connection.close.restore();
    logger.error.restore();
  });

  it('closes connection on error', () => {
    const connectionClosedStub = stub(mongoose.connection, 'close', () => { console.log('Mocked connection closed'); });
    const loggerStub = stub(logger, 'error');

    mongoose.connection.emit('error', new Error('Mocked mongo error'));

    assert.isTrue(connectionClosedStub.calledOnce);
    assert.isTrue(loggerStub.calledOnce);

    const mockedError = loggerStub.firstCall.args[0];

    assert.equal(mockedError.message, 'Mongo connection error: check if mongod process is running!\nMocked mongo error');
  });
});
