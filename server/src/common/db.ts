import Knex from 'knex';
import { KNEX } from './config';

export const knex = Knex({
  client: 'pg',
  connection: {
    host: KNEX.HOST,
    user: KNEX.USERNAME,
    password: KNEX.PASSWORD,
    database: 'monitoring',
  },
});
