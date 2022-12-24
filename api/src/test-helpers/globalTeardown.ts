import { getTestKnexClient, getTestKnexWithoutDatabase } from './setupDb'

export default async function globalTeardown(): Promise<void> {
  const knex1 = getTestKnexWithoutDatabase()
  const knex2 = getTestKnexClient()
  await Promise.all([knex1.destroy(), knex2.destroy()])
}
