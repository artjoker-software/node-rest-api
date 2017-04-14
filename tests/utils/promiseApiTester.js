import apiTesterFactory from 'supertest';
import app from '../../api';
import { auth } from '../../config';

const tokenKey = auth.base.headers.accessToken;

class ApiTester {

  mock = apiTesterFactory(app);

  get(url, status = 200, token = null) {
    return new Promise((resolve, reject) => {
      this.mock
        .get(url)
        .expect(status)
        .set(tokenKey, token)
        .end((error, { body }) => error ? reject(error) : resolve(body));
    });
  }

  post(url, requestData, status = 200, token = null) {
    return new Promise((resolve, reject) => {
      this.mock
        .post(url)
        .expect(status)
        .set(tokenKey, token)
        .send(requestData)
        .end((error, { body }) => error ? reject(error) : resolve(body));
    });
  }

  put(url, requestData, status = 200, token = null) {
    return new Promise((resolve, reject) => {
      this.mock
        .put(url)
        .expect(status)
        .set(tokenKey, token)
        .send(requestData)
        .end((error, { body }) => error ? reject(error) : resolve(body));
    });
  }

  delete(url, status = 204, token = null) {
    return new Promise((resolve, reject) => {
      this.mock
        .delete(url)
        .expect(status)
        .set(tokenKey, token)
        .end((error, { body }) => error ? reject(error) : resolve(body));
    });
  }
}

export default new ApiTester();
