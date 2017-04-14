import DAOProxy from './dao-proxy';

export default class BaseDAO {

  daoProxy;

  constructor(mongooseModel) {
    this.daoProxy = new DAOProxy(mongooseModel);
  }

  loadBy(by, projection = {}) {
    return this.daoProxy.loadBy(by, projection);
  }

  loadById(id) {
    return this.loadBy({ id });
  }

  load(params = {}) {
    return this.daoProxy.load(params);
  }

  create(params) {
    return this.daoProxy.create(params);
  }

  update({ id, ...params }) {
    return this.updateBy({ by: { id }, $set: params });
  }

  updateBy(params) {
    return this.daoProxy.updateBy(params);
  }

  remove(id) {
    return this.daoProxy.remove(id);
  }

  removeAll(query = {}) {
    return this.daoProxy.removeAll(query);
  }

  populate(parentParams, pathParams) {
    return this.daoProxy.populate(parentParams, pathParams);
  }

  populateAll(parentParams, pathParams) {
    return this.daoProxy.populateAll(parentParams, pathParams);
  }

}
