import co from 'co';
import { assert } from 'chai';
import mongoose, { Schema } from 'mongoose';
import mongoMapper from '../../utils/mongo-mapper';
import flattenObject from '../../../utils/general/flattenObject';

describe('Flatten object suite', () => {
  let Test = null;

  const dbMock = {
    number: 3,
    string: 'Hello world',
    boolean: true,
    object: { string: 'hello', number: 1, boolean: false, object: {}, array1: [], array2: [{ hi: 'hello' }] },
    arrayOfStrings: ['my', 'name', 'is', 'John'],
    arrayOfNumbers: [1, 2, 3, 4, 5],
    arrayOfBooleans: [true, false, false],
    arrayOfObjects: [{ string: 'string', boolean: false }, {}, {}, { number: 5, array: ['strings', 'work'] }]
  };

  before(() => {
    const TestSchema = new Schema({
      number: Number,
      string: String,
      boolean: Boolean,
      object: {},
      arrayOfStrings: [String],
      arrayOfNumbers: [Number],
      arrayOfBooleans: [Boolean],
      arrayOfObjects: [{}]
    }, { versionKey: false });

    Test = mongoose.model('Test', TestSchema);
  });

  it('flattens a complex object for a mongo search', () => {
    const shouldEqual = { ...dbMock };

    shouldEqual.number = dbMock.number;
    shouldEqual.string = dbMock.string;
    shouldEqual.boolean = dbMock.boolean;
    shouldEqual['object.number'] = dbMock.object.number;
    shouldEqual['object.string'] = dbMock.object.string;
    shouldEqual['object.boolean'] = dbMock.object.boolean;
    shouldEqual['object.array1'] = dbMock.object.array1;
    shouldEqual['object.array2'] = dbMock.object.array2;
    delete shouldEqual.object;

    // Code for array support test
    // shouldEqual['object.array2.0'] = dbMock.object.array2[0];

    // for (const key of Object.keys(dbMock.arrayOfNumbers)) {
    //   shouldEqual['arrayOfNumbers.' + key] = dbMock.arrayOfNumbers[key];
    // }
    //
    // for (const key of Object.keys(dbMock.arrayOfStrings)) {
    //   shouldEqual['arrayOfStrings.' + key] = dbMock.arrayOfStrings[key];
    // }
    //
    // for (const key of Object.keys(dbMock.arrayOfBooleans)) {
    //   shouldEqual['arrayOfBooleans.' + key] = dbMock.arrayOfBooleans[key];
    // }
    //
    // for (const key of Object.keys(dbMock.arrayOfObjects)) {
    //   shouldEqual['arrayOfObjects.' + key] = dbMock.arrayOfObjects[key];
    // }

    assert.deepEqual(flattenObject(dbMock), shouldEqual);
  });

  it('does not flatten the ignored keys', () => {
    const omit = Object.keys(dbMock).slice(3);
    assert.deepEqual(flattenObject(dbMock, undefined, omit), dbMock);
  });

  it('checks the search in Mongo', () => co(function* () {
    yield mongoMapper.clearCollection('tests');
    yield mongoMapper.insert('tests', dbMock);

    const flattened = flattenObject({ ...dbMock, _id: undefined });

    const results = yield Test.find(flattened, '-_id').lean().exec();
    assert.equal(results.length, 1);
    delete dbMock._id;
    assert.deepEqual(results[0], dbMock);
  }));
});
