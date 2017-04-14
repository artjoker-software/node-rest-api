import co from 'co';
import { assert } from 'chai';
import { stub } from 'sinon';
import { MongoClient } from 'mongodb';
import { connectionString } from '../../../database';
import MongoMapperProvider from '../../utils/mongo/mongo-mapper-provider';

describe('mongo mapper suite', () => {
  it('creates new mongo mapper from valid connection string', () => {
    const mongoMapperProvider = new MongoMapperProvider();
    const mongomapper = mongoMapperProvider.getMongoMapper(connectionString);

    assert.isOk(mongomapper);
  });

  it('creates new mongo mapper from valid connection string twice, to ensure in memoization of dbContext', () => {
    const mongoMapperProvider = new MongoMapperProvider();
    mongoMapperProvider.getMongoMapper(connectionString);
    mongoMapperProvider.getMongoMapper(connectionString);
  });

  it('throws an error on db client connection error', () => co(function* () {
    const mongoMapperProvider = new MongoMapperProvider();

    const connectStub = stub(MongoClient, 'connect', (string, cb) => {
      cb(new Error('Mock error'));
    });

    const { _dbContextPromise: promise } = mongoMapperProvider.getMongoMapper(connectionString);
    assert.isTrue(connectStub.calledOnce);

    try {
      yield promise;
      throw new Error('Should not execute');
    } catch (error) {
      assert.equal(error.message, 'Mock error');
    }

    MongoClient.connect.restore();
  }));
});
