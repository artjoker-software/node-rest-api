import { parse } from 'querystring';
import EXPRESSION_KEYS from './expressions';

export default class ExpressionParser {

  parsers;

  constructor() {
    this.parsers = new Map();

    this.parsers.set(EXPRESSION_KEYS.DEFAULT, this.parseDefaultExpression);
    this.parsers.set(EXPRESSION_KEYS.IN, this.parseInExpression);
    this.parsers.set(EXPRESSION_KEYS.LIKE, this.parseLikeExpression);
  }

  parse(expressionKey, expressionValue, filterKey) {
    return this.parsers.has(expressionKey) ?
      this.parsers.get(expressionKey)(expressionValue, filterKey) :
      this.parsers.get(EXPRESSION_KEYS.DEFAULT)(expressionValue, filterKey);
  }

  parseDefaultExpression(expressionValue, filterKey) {
    return { [filterKey]: expressionValue };
  }

  parseInExpression(expressionValue, filterKey) {
    const array = (expressionValue.constructor === Array) ? expressionValue : expressionValue.split(',');
    const $in = array.map(exp => exp.trim());
    return { [filterKey]: { $in } };
  }

  parseLikeExpression(expressionValue) {
    const [fieldOption, valueOption] = expressionValue.split('|').map(exp => exp.trim());
    const fieldName = fieldOption.substr(1).trim();
    const value = valueOption.substr(0, valueOption.length - 1).trim();

    return { [fieldName]: { $regex: value, $options: 'i' } };
  }
  parsePopulateParams(path, stringValue) {
    const { $sort, $select, $like, $limit, $skip, ...params } = parse(stringValue.slice(1, -1).replace(/ /g, ''), ';');

    const like = {};
    if ($like) {
      const likeArr = $like.replace(/ /g, '').split(',');
      for (let idx = 0; idx < likeArr.length; idx += 2) {
        like[likeArr[idx]] = new RegExp(likeArr[idx + 1], 'i');
      }
    }

    const search = {};
    const extra = Object.keys(params).filter(key => !!(key));
    if (extra.length > 0) {
      for (const key of extra) {
        search[key] = { $in: params[key].replace(/ /g, '').split(',') };
      }
    }

    const match = {
      ...search,
      ...like
    };

    const select = { select: ($select) ? `${$select.replace(/,/g, ' ')} -_id` : '-_id' };
    const sort = ($sort) ? { sort: $sort.replace(/,/g, ' ') } : { };
    const limit = ($limit && !isNaN(parseInt(+$limit, 10))) ? { limit: parseInt(+$limit, 10) } : { };
    const skip = ($skip && !isNaN(parseInt(+$skip, 10))) ? { skip: parseInt(+$skip, 10) } : { };

    return {
      path,
      ...select,
      match,
      options: { ...sort, ...limit, ...skip }
    };
  }
}
