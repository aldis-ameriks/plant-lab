import Knex from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexfile = require('../knexfile');

export const knex = Knex(knexfile);
