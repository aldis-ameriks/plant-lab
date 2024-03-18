import { clearTestDb, getTestDbClient, getTestDbWithoutDatabase } from './setupDb'

export default async function globalTeardown(): Promise<void> {
  const { sqlWithoutDatabase } = getTestDbWithoutDatabase()
  const { sql } = getTestDbClient()
  try {
    await Promise.all([sql.end(), sqlWithoutDatabase.end()])
  } finally {
    clearTestDb()
  }
}
