import { join } from 'path';
import { KNEX } from './common/config';

module.exports = {
  client: 'pg',
  connection: {
    host: KNEX.HOST,
    user: KNEX.USERNAME,
    password: KNEX.PASSWORD,
    port: KNEX.PORT,
    database: 'monitoring',
  },
  migrations: {
    directory: join(__dirname, '..', 'migrations'),
    loadExtensions: ['.ts'],
  },
};
