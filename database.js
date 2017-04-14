import mongoose from 'mongoose';
import unique from 'mongoose-unique-validator';
import immutable from 'mongoose-immutable';
import * as shortid from 'shortid';
import dbConfig from './config/db';
import logger from './lib/logger';

mongoose.Promise = Promise;

mongoose.plugin(unique);
mongoose.plugin(immutable);

export const id = {
  type: String,
  default: shortid.generate,
  index: true,
  unique: true
};

const { host, port, db_name: name } = dbConfig[process.env.NODE_ENV || 'local'];
export const connectionString = `mongodb://${host}:${port}/${name}`;

export const defaultSchemaOptions = {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true,
    getters: true
  }
};

mongoose.connect(connectionString, { config: { autoIndex: false } });

mongoose.connection.on('error', (err) => {
  err.message = `Mongo connection error: check if mongod process is running!\n${err.message}`;
  logger.error(err);
  mongoose.connection.close();
});
