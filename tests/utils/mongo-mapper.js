import MongoMapperProvider from './mongo/mongo-mapper-provider';
import { connectionString } from '../../database';

const mongoMapperProvider = new MongoMapperProvider();

export default mongoMapperProvider.getMongoMapper(connectionString);

