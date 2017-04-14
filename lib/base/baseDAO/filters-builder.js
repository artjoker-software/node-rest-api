import ExpressionAnalyzer from './expression-analyzer';
import ExpressionParser from './expression-parser';

export default class FiltersBuilder {

  static DEFAULT_PARAMS = {
    limit: 1000,
    skip: 0
  };

  expressionAnalyzer;
  expressionParser;

  constructor() {
    this.expressionAnalyzer = new ExpressionAnalyzer();
    this.expressionParser = new ExpressionParser();
  }

  buildFilters(filters) {
    const queryFilters = {};
    for (const filterName of Object.keys(filters)) {
      const expressionValue = filters[filterName];
      const expressionKey = this.expressionAnalyzer.analyze(expressionValue);
      const parserResult = this.expressionParser.parse(expressionKey, expressionValue, filterName);
      const [queryFilterPropertyName] = Object.keys(parserResult);
      queryFilters[queryFilterPropertyName] = parserResult[queryFilterPropertyName];
    }
    return queryFilters;
  }

  buildSkipFilters(skipFilters) {
    return isNaN(+skipFilters) ? FiltersBuilder.DEFAULT_PARAMS.skip : +skipFilters;
  }

  buildLimitFilters(limitFilters) {
    return isNaN(+limitFilters) ? FiltersBuilder.DEFAULT_PARAMS.limit : +limitFilters;
  }

  getPopulateParams(filters) {
    return Object.keys(filters)
      .filter(key => key[0] === '*')
      .map(key => this.expressionParser.parsePopulateParams(key.slice(1), filters[key]));
  }

  filterOutPopulateParams(filters) {
    const obj = {};

    Object.keys(filters)
      .filter(key => key[0] !== '*')
      .forEach((key) => {
        obj[key] = filters[key];
      });

    return obj;
  }
}
