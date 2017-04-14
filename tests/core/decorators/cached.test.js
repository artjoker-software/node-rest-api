import { assert } from 'chai';
import { cached } from '../../../lib/decorators';

describe('Request validation decorator suite', () => {
  @cached // eslint-disable-line padded-blocks
  class SomeMockClass {}

  it('checks decorated class props', () => {
    const instanceOfDecoratedClass = new SomeMockClass();

    assert.equal(instanceOfDecoratedClass.isCacheEnabled, true);
  });
});
