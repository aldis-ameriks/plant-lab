import nock from 'nock'
import {
  clearTestDb,
  createDatabase,
  dropDatabase,
  getTestDbClient,
  getTestDbWithoutDatabase,
  runMigrations,
  runSeeds
} from './setupDb.ts'

nock.disableNetConnect()

const { sqlWithoutDatabase } = getTestDbWithoutDatabase()

try {
  await dropDatabase(sqlWithoutDatabase)
  // eslint-disable-next-line no-empty
} catch (e) {}

await createDatabase(sqlWithoutDatabase)
await sqlWithoutDatabase.end()

const { sql, db } = getTestDbClient()
await runMigrations(sql, db)
await runSeeds(db)
await sql.end()
clearTestDb()
