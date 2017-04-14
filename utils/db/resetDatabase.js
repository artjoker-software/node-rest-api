import co from 'co';
import mongoMapper from '../../tests/utils/mongo-mapper';
import dbConfig from '../../config/db';
import users from '../../docs/db-snippets/users.json';

const collections = [users];
const names = ['users'];
const db = dbConfig[process.env.NODE_ENV];

co(function* () {
  yield mongoMapper.drop();
  console.log(`Dropped the "${db.db_name}" database on port ${db.port}.`);

  for (let idx = 0; idx < names.length; idx += 1) {
    yield mongoMapper.insert(names[idx], collections[idx]);
    console.log(`Imported ${collections[idx].length} documents to "${names[idx]}"`);
  }

  console.log(`Populated the "${db.db_name}" database with ${names.length} collections.`);

  process.kill(0);
})
  .catch(err => console.error(err));
