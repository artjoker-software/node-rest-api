import co from 'co';
import { assert } from 'chai';
import { stub } from 'sinon';
import { MongoClient } from 'mongodb';
import { connectionString } from '../../../../database';
import MongoMapperProvider from '../../../utils/mongo/mongo-mapper-provider';

const collectionName = 'products';

const mockReject = (collection, funcName, params = {}) => co(function* () {
  const connectStub = stub(MongoClient, 'connect', (string, cb) => { cb(null, { collection: () => collection }); });

  const mockMongoMapperProvider = new MongoMapperProvider();
  const mockMongoMapper = mockMongoMapperProvider.getMongoMapper(connectionString);
  assert.isTrue(connectStub.calledOnce);

  try {
    yield mockMongoMapper[funcName](collectionName, params);
    throw new Error('Should not execute');
  } catch (err) {
    assert.equal(err.message, 'Mock error');
  }
});

const mockError = new Error('Mock error');

const collection = {
  findOne: {
    findOne: (param, callback) => callback(mockError)
  },
  find: {
    find: () => ({
      toArray: callback => callback(mockError)
    })
  },
  insert: {
    insert: (data, callback) => callback(mockError)
  },
  update: {
    findAndModify: (criteria, sort, replace, options, callback) => callback(mockError)
  },
  remove: {
    remove: (params, callback) => callback(mockError)
  }
};

describe('Query capabilities of MongoMapper class', () => {
  afterEach(() => MongoClient.connect.restore());

  it('throws on find', () => mockReject(collection.find, 'find'));

  it('throws on find one', () => mockReject(collection.findOne, 'findOne'));

  it('throws on insert', () => mockReject(collection.insert, 'insert'));

  it('throws on update', () => mockReject(collection.update, 'update'));

  it('throws on remove', () => mockReject(collection.remove, 'remove'));
});
