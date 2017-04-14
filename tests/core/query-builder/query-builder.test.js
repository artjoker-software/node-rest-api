import { assert } from 'chai';
import QueryBuilder from '../../../lib/base/baseDAO/query-builder';

describe('Query builder class suite', () => {
  const queryBuilder = new QueryBuilder();
  const queryParams = {
    $sort: '-id',
    $limit: 15,
    $skip: 3,
    id: '1',
    name: 'John, Dry, Doe',
    $like: '(age|5)',
    cardNumber: 13124,
    daysOff: 'Mon,Thu'
  };

  const queryMock = function Mock(filters) {
    this.filters = filters;

    this.limit = (limit) => {
      this.limit = limit;
      return this;
    };

    this.sort = (sort) => {
      this.sort = sort;
      return this;
    };

    this.skip = (skip) => {
      this.skip = skip;
      return this;
    };

    this.select = (select) => {
      this.select = select;
      return this;
    };

    return this;
  };

  it('builds query', () => {
    const queryBuilderBuildResult = queryBuilder.build(queryMock, queryParams);

    assert.deepEqual(queryBuilderBuildResult.filters, {
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

    assert.equal(queryBuilderBuildResult.sort, '-id');
    assert.equal(queryBuilderBuildResult.limit, 15);
    assert.equal(queryBuilderBuildResult.skip, 3);
  });
});
