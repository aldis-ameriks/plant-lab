import dotenv from 'dotenv'
import nock from 'nock'
dotenv.config()

nock.disableNetConnect()

import {
  dropDatabase,
  createDatabase,
  runMigrations,
  getTestKnexClient,
  getTestKnexWithoutDatabase,
  runSeeds
} from './setupDb'

export default async function globalSetup(): Promise<void> {
  let knex = getTestKnexWithoutDatabase()

  try {
    await dropDatabase(knex)
    // eslint-disable-next-line no-empty
  } catch (e) {}

  await createDatabase(knex)
  knex = getTestKnexClient()
  await runMigrations(knex)
  await runSeeds(knex)
}
