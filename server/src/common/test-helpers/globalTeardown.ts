import Knex from 'knex';

import { dropDatabase, getTestKnexConfig } from './testDb';

module.exports = async function globalTeardown() {
  const knex = Knex(getTestKnexConfig());
  try {
    await dropDatabase(knex);
  } catch (e) {
    console.error(e);
  }
};
