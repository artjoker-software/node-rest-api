import { assert } from 'chai';
import sortKeys from '../../../utils/general/sortObjectKeys';

describe('Flatten object suite', () => {
  it('returns an empty object if nothing is supplied', () => {
    assert.deepEqual(sortKeys(), {});
    assert.deepEqual(sortKeys(undefined), {});
    assert.deepEqual(sortKeys(null), {});
  });

  it('returns an empty object if anything but object is supplied', () => {
    assert.deepEqual(sortKeys(false), {});
    assert.deepEqual(sortKeys(1), {});
    assert.deepEqual(sortKeys(''), {});
    assert.deepEqual(sortKeys('asd'), {});
    assert.deepEqual(sortKeys([]), {});
    assert.deepEqual(sortKeys([1, 2, 3]), {});
  });

  it('returns an object with sorted keys for the response', () => {
    const input = { z: 1, x: 2, b: 3, a: 4 };
    assert.deepEqual(Object.values(sortKeys(input)), [4, 3, 2, 1]);
  });

  it('gives id and timestamps custom priorities', () => {
    const input = { z: 1, x: 2, b: 3, a: 4, updated_at: 5, created_at: 6, id: 7 };
    assert.deepEqual(Object.values(sortKeys(input)), [7, 4, 3, 2, 1, 6, 5]);
  });
});
