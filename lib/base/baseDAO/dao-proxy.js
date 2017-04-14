import co from 'co';
import QueryBuilder from './query-builder';

export default class DAOPRoxy {

  model;
  queryBuilder;

  constructor(model) {
    this.model = model;
    this.queryBuilder = new QueryBuilder();
  }

  loadBy(by, projection) {
    return co(function* () {
      const document = yield this.model.findOne(by, projection).exec();
      return (document) ? { ...document.toObject(), _id: undefined } : {};
    }
      .bind(this));
  }

  load(params, lean = true) {
    return co(function* () {
      const query = this.buildQueryWithParams(params);
      const queriedValue = yield query.exec();
      return queriedValue.map(item => lean ? item.toObject() : item);
    }
      .bind(this));
  }

  create(params) {
    return co(function* () {
      const created = yield this.model.create(params);
      return { ...created.toObject(), _id: undefined };
    }
      .bind(this));
  }

  updateBy({ by, ...params }) {
    return co(function* () {
      const updated = yield this.model.findOneAndUpdate(
        by,
        params,
        { new: true }
      );

      return (updated) ? { ...updated.toObject(), _id: undefined } : {};
    }
      .bind(this));
  }

  remove(id) {
    return this.model.findOneAndRemove({ id });
  }

  removeAll(query) {
    return this.model.remove(query);
  }

  populate(params, path) {
    return co(function* () {
      const query = this.buildQueryWithParams(params);
      const populatedQuery = query.populate(path, QueryBuilder.NO_ID);
      const populatedQueryResult = yield populatedQuery.exec();
      return populatedQueryResult[0];
    }
      .bind(this));
  }

  populateAll(params, path) {
    return co(function* () {
      const query = this.buildQueryWithParams(params);
      const populatedQuery = query.populate(path, QueryBuilder.NO_ID);
      return yield populatedQuery.exec();
    }
      .bind(this));
  }

  buildQueryWithParams(params) {
    const query = this.model.find.bind(this.model);
    return this.queryBuilder.build(query, params);
  }
}
