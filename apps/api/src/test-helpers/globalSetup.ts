import 'dotenv/config'
import nock from 'nock'
import {
  createDatabase,
  dropDatabase,
  getTestDbClient,
  getTestDbWithoutDatabase,
  runMigrations,
  runSeeds
} from './setupDb'

nock.disableNetConnect()
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export default async function globalSetup(): Promise<void> {
  const { sqlWithoutDatabase } = getTestDbWithoutDatabase()

  try {
    await dropDatabase(sqlWithoutDatabase)
    // eslint-disable-next-line no-empty
  } catch (e) {}

  await createDatabase(sqlWithoutDatabase)
  const { sql, db } = getTestDbClient()
  await runMigrations(sql, db)
  await runSeeds(db)
}
