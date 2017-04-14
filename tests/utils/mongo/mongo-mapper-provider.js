import { MongoClient } from 'mongodb';
import MongoMapper from './mongo-mapper';

class MongoMapperProvider {

  dbContext = null;

  getMongoMapper(connectionString) {
    const dbContextPromise = this.getDbContextPromise(connectionString);
    return new MongoMapper(dbContextPromise);
  }

  getDbContextPromise(connectionString) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(connectionString, (error, dbContext) => {
        if (error) {
          return reject(error);
        }

        if (this.dbContext !== null) {
          return Promise.resolve(this.dbContext);
        }

        this.dbContext = dbContext;

        return resolve(dbContext);
      });
    });
  }

}

export default MongoMapperProvider;
