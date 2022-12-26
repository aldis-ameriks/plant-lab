import { Knex } from 'knex'
import { getTestKnexClient } from './setupDb'

export function getTestKnex() {
  const knexClient = getTestKnexClient()
  const result = {} as { knex: Knex.Transaction }

  beforeEach(async () => {
    result.knex = await knexClient.transaction()
  })

  afterEach(async () => {
    await result.knex.rollback()
  })

  afterAll(async () => {
    // Not sure if this will be stable. Multiple testing destroying the same knexClient?
    await knexClient.destroy()
  })

  return result as { knex: Knex }
}
