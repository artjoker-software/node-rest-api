import co from 'co';
import { assert } from 'chai';
import flattenObject from '../../../utils/general/flattenObject';

/* eslint-disable arrow-body-style */
export default class MongoMapper {

  _dbContextPromise;

  constructor(dbContextPromise) {
    this._dbContextPromise = dbContextPromise;
  }

  find(collection, params = {}) {
    return new Promise((resolve, reject) => {
      return co(function* () {
        const dbContext = yield this.getDbContext();
        return dbContext
          .collection(collection)
          .find(flattenObject(params))
          .toArray((error, documents) => {
            if (error) {
              return reject(error);
            }
            return resolve(documents);
          });
      }
        .bind(this));
    });
  }

  findOne(collection, params) {
    return new Promise((resolve, reject) => {
      return co(function* () {
        const dbContext = yield this.getDbContext();
        return dbContext
          .collection(collection)
          .findOne(flattenObject(params), (error, documents) => {
            if (error) {
              return reject(error);
            }
            return resolve(documents);
          });
      }
        .bind(this));
    });
  }

  insert(collection, data) {
    return new Promise((resolve, reject) => {
      return co(function* () {
        const dbContext = yield this.getDbContext();

        return dbContext
          .collection(collection)
          .insert(data, (error, inserted) => {
            if (error) {
              return reject(error);
            }
            return resolve(inserted);
          });
      }
        .bind(this));
    });
  }

  update(collection, criteria, replacement) {
    return new Promise((resolve, reject) => {
      return co(function* () {
        const dbContext = yield this.getDbContext();
        return dbContext
          .collection(collection)
          .findAndModify(criteria, null, { $set: replacement }, { new: true }, (error, updated) => {
            if (error) {
              return reject(error);
            }
            return resolve(updated.value);
          });
      }
        .bind(this));
    });
  }

  remove(collection, params = {}) {
    return new Promise((resolve, reject) => {
      return co(function* () {
        const dbContext = yield this.getDbContext();

        return dbContext
          .collection(collection)
          .remove(params, (error, data) => {
            if (error) {
              return reject(error);
            }

            return resolve(data);
          });
      }
        .bind(this));
    });
  }

  haveOneInCollection(collection, documentParams) {
    return co(function* () {
      const dbDocument = yield this.findOne(collection, documentParams);
      assert.isOk(dbDocument, 'couldn\'t find the object');
      // Key-by-key deep equal check
      for (const prop of Object.keys(documentParams)) {
        assert.deepEqual(documentParams[prop], dbDocument[prop], `Values during find didn't match on '${prop}' field`);
      }
    }
      .bind(this));
  }

  haveInCollection(collection, documentsParams) {
    return co(function* () {
      if (documentsParams.constructor === Array) {
        assert.isArray(documentsParams);
        for (const documentParams of documentsParams) {
          yield this.haveOneInCollection(collection, documentParams);
        }
      } else {
        assert.isObject(documentsParams);
        yield this.haveOneInCollection(collection, documentsParams);
      }
    }
      .bind(this));
  }

  dontHaveOneInCollection(collection, documentParams) {
    return co(function* () {
      const documents = yield this.find(collection, documentParams);

      assert.equal(documents.length, 0, 'Found the document');
    }
      .bind(this));
  }

  dontHaveInCollection(collection, documentsParams) {
    return co(function* () {
      if (documentsParams.constructor === Array) {
        assert.isArray(documentsParams);
        for (const documentParams of documentsParams) {
          yield this.dontHaveOneInCollection(collection, documentParams);
        }
      } else {
        assert.isObject(documentsParams);
        yield this.dontHaveOneInCollection(collection, documentsParams);
      }
    }
      .bind(this));
  }

  clearCollection(collection) {
    return co(function* () {
      yield this.remove(collection);
    }
      .bind(this));
  }

  clearCollections(collections) {
    return co(function* () {
      const promises = [];
      for (const name of collections) {
        promises.push(this.remove(name));
      }
      yield promises;
    }
      .bind(this));
  }

  drop() {
    return co(function* () {
      const db = yield this.getDbContext();
      return yield db.dropDatabase();
    }
      .bind(this));
  }

  getDbContext() {
    return co(function* () {
      return yield this._dbContextPromise;
    }
      .bind(this));
  }
}
/* eslint-enable arrow-body-style */
