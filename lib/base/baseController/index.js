export default class BaseController {

  service;

  constructor(service) {
    this.service = service;
  }

  * create({ body }, response) {
    const model = yield this.service.create(body);
    return response.ok(model);
  }

  * load({ query, params }, response) {
    const modelList = yield this.service.load(query, params);
    return response.ok(modelList);
  }

  * loadById({ params }, response) {
    const model = yield this.service.loadById(params.id);
    return response.ok(model);
  }

  * update({ body, params }, response) {
    const updated = yield this.service.update({ ...params, ...body });
    return response.ok(updated);
  }

  * remove({ params }, response) {
    yield this.service.remove(params.id);
    return response.noContent();
  }
}
