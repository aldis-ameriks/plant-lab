import { getTestDbClient } from './setupDb'

export function getTestDb() {
  const dbClient = getTestDbClient()
  const result = { db: dbClient.db, sql: dbClient.sql }

  beforeEach(async () => {
    await dbClient.sql`BEGIN;`
  })

  afterEach(async () => {
    await dbClient.sql`ROLLBACK;`
  })

  afterAll(async () => {
    // Not sure if this will be stable. Multiple testing destroying the same client?
    await dbClient.sql.end()
  })

  return result
}
