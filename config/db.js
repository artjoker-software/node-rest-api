export default {
  local: {
    host: 'localhost',
    port: '27017',
    db_name: 'local-db'
  },
  test: {
    host: 'localhost',
    port: '27017',
    db_name: 'local-db-testing'
  },
  development: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db_name: process.env.DB_NAME
  },
  staging: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db_name: process.env.DB_NAME
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db_name: process.env.DB_NAME
  }
};
