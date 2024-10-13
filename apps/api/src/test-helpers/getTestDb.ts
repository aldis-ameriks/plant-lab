import { beforeEach, afterEach, after, before } from 'node:test'
import { getTestDbClient } from './setupDb.ts'

export function getTestDb() {
  const result = {} as ReturnType<typeof getTestDbClient>

  before(() => {
    const dbClient = getTestDbClient()
    result.db = dbClient.db
    result.sql = dbClient.sql
  })

  beforeEach(async () => {
    await result.sql`BEGIN;`
  })

  afterEach(async () => {
    await result.sql`ROLLBACK;`
  })

  after(async () => {
    // Not sure if this will be stable. Multiple testing destroying the same client?
    await result.sql.end()
  })

  return result
}
