import Knex from 'knex';

import { dropDatabase, getTestKnexConfig } from './testDb';

export default async function globalTeardown() {
  const knex = Knex(getTestKnexConfig());
  try {
    await dropDatabase(knex);
  } catch (e) {
    console.error(e);
  }
}
