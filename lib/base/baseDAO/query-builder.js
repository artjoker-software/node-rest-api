import FiltersBuilder from './filters-builder';

export default class QueryBuilder {

  query;
  filtersBuilder;
  static NO_ID = { _id: 0 };

  constructor() {
    this.filtersBuilder = new FiltersBuilder();
  }

  build(query, { $sort, $limit, $skip, $select, ...filters }) {
    this.query = query;

    this.buildFiltersPart(filters);
    this.buildPopulatePart(filters);
    this.buildSelectPart($select);
    this.buildSortPart($sort);
    this.buildSkipPart($skip);
    this.buildLimitPart($limit);

    // this.query = this.query.lean();

    return this.query;
  }

  buildFiltersPart(filters = {}) {
    const neededFilters = this.filtersBuilder.filterOutPopulateParams(filters);
    this.query = this.query(this.getFilters(neededFilters));
  }

  buildSortPart($sort) {
    if ($sort) {
      this.query = this.query.sort($sort);
    }
  }

  buildSelectPart($select) {
    this.query = this.query.select({ ...QueryBuilder.NO_ID, ...$select });
  }

  buildSkipPart($skip) {
    this.query = this.query.skip(this.filtersBuilder.buildSkipFilters($skip));
  }

  buildLimitPart($limit) {
    this.query = this.query.limit(this.filtersBuilder.buildLimitFilters($limit));
  }

  buildPopulatePart(filters) {
    const populateParams = this.filtersBuilder.getPopulateParams(filters);

    for (const param of populateParams) {
      this.query = this.query.populate(param);
    }
  }

  getFilters(filters) {
    return this.filtersBuilder.buildFilters(filters);
  }
}
