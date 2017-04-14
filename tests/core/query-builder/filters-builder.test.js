import { assert } from 'chai';
import FiltersBuilder from '../../../lib/base/baseDAO/filters-builder';

describe('Filters builder suite', () => {
  const filtersBuilder = new FiltersBuilder();

  const filtersMock = {
    id: '1',
    name: 'John, Dry, Doe',
    $like: '(age|5)',
    cardNumber: 13124,
    daysOff: 'Mon,Thu'
  };

  it('builds $limit params', () => {
    assert.equal(filtersBuilder.buildLimitFilters(1), 1);
    assert.equal(filtersBuilder.buildLimitFilters('2'), 2);
    assert.equal(filtersBuilder.buildLimitFilters('hhh'), 1000);
    assert.equal(filtersBuilder.buildLimitFilters(), 1000);
  });

  it('builds $skip params', () => {
    assert.equal(filtersBuilder.buildSkipFilters(1), 1);
    assert.equal(filtersBuilder.buildSkipFilters('2'), 2);
    assert.equal(filtersBuilder.buildSkipFilters('hhh'), 0);
    assert.equal(filtersBuilder.buildSkipFilters(), 0);
  });

  it('builds filters', () => {
    const builtFilters = filtersBuilder.buildFilters(filtersMock);
    assert.deepEqual(builtFilters, {
      id: '1',
      name: {
        $in: ['John', 'Dry', 'Doe']
      },
      age: {
        $regex: '5', $options: 'i'
      },
      cardNumber: 13124,
      daysOff: {
        $in: ['Mon', 'Thu']
      }
    });
  });
});
