import { assert } from 'chai';
import proxyquire from 'proxyquire';

describe('Logger error suite', () => {
  it('should log to console on development env', () => {
    process.env.NODE_ENV = 'development';
    const logger = proxyquire('../../../lib/logger', {});
    process.env.NODE_ENV = 'test';

    const transports = Object.keys(logger.transports);

    assert.equal(transports.length, 1, 'there should be only console transport');
    assert.deepEqual(transports, ['console'], 'there should be only console transport');
  });

  it('should have no transports it\'s testing env (no console log)', () => {
    const logger = proxyquire('../../../lib/logger', {});
    const transports = Object.keys(logger.transports);

    // Should work with a flag
    const hasFlag = (process.argv[process.argv.length - 1] === 'log');

    assert.equal(transports.length, +hasFlag, 'there should be no logger transports');
  });
});
