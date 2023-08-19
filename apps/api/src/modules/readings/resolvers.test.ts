import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import { setupGraphql } from '../../test-helpers/setupGraphql'
import * as seeds from '../../test-helpers/seeds'
import { ReadingEntity, UsersDeviceEntity } from '../../types/entities'

const gql = setupGraphql()

let app: FastifyInstance
let knex: Knex

beforeEach(async () => {
  app = gql.app
  knex = gql.knex

  await knex('user_access_keys')
    .update({ roles: ['HUB'] })
    .where('access_key', seeds.userAccessKey.access_key)
})

test('checks user auth', async () => {
  await knex('user_access_keys').update({ roles: [] }).where('access_key', seeds.userAccessKey.access_key)
  const input = 'xxx'
  const query = `mutation { saveReading(input: "${input}") }`
  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
  const parsedBody = JSON.parse(result.body)
  expect(parsedBody.data).toBeNull()
  expect(parsedBody.errors[0].message).toBe('Failed auth policy check on saveReading')
})

test('validates input', async () => {
  const input = 'xxx'
  const query = `mutation { saveReading(input: "${input}") }`
  const result = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: { 'x-access-key': seeds.userAccessKey.access_key },
    payload: { query }
  })
  const parsedBody = JSON.parse(result.body)
  expect(parsedBody.data).toBeNull()
  expect(parsedBody.errors[0].message).toBe('Invalid input')
})

test('validates input', async () => {
  const input = 'xxx'
  const query = `mutation { saveReading(input: "${input}") }`
  const result = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: { 'x-access-key': seeds.userAccessKey.access_key },
    payload: { query }
  })
  const parsedBody = JSON.parse(result.body)
  expect(parsedBody.data).toBeNull()
  expect(parsedBody.errors[0].message).toBe('Invalid input')
})

test('verifies user owns device', async () => {
  await knex('users_devices').where('user_id', seeds.user.id).del()
  const input = '1;2;3;4;5;6;7;8;9;10;11'
  const query = `mutation { saveReading(input: "${input}") }`

  let result = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: { 'x-access-key': seeds.userAccessKey.access_key },
    payload: { query }
  })
  let parsedBody = JSON.parse(result.body)
  expect(parsedBody.data).toBeNull()
  expect(parsedBody.errors[0].message).toBe('Forbidden')

  await knex<UsersDeviceEntity>('users_devices').insert({
    user_id: seeds.user.id,
    device_id: seeds.device.id
  })

  result = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: { 'x-access-key': seeds.userAccessKey.access_key },
    payload: { query }
  })
  parsedBody = JSON.parse(result.body)
  expect(parsedBody).toEqual({ data: { saveReading: 'success' } })
})

test('saves reading', async () => {
  await knex('readings').where('device_id', seeds.device.id).del()
  const input = '1;2;3;4;5;6;7;8;9;10;11'
  const query = `mutation { saveReading(input: "${input}") }`

  let readings = await knex<ReadingEntity>('readings').where('device_id', seeds.device.id)
  expect(readings.length).toBe(0)

  const result = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: { 'x-access-key': seeds.userAccessKey.access_key },
    payload: { query }
  })
  const parsedBody = JSON.parse(result.body)
  expect(parsedBody).toEqual({ data: { saveReading: 'success' } })

  readings = await knex<ReadingEntity>('readings').where('device_id', seeds.device.id)
  expect(readings).toMatchObject([
    {
      device_id: seeds.device.id,
      moisture_raw: '2',
      moisture: '3',
      moisture_min: '4',
      moisture_max: '5',
      temperature: '6',
      light: '7',
      battery_voltage: '8',
      signal: '9',
      reading_id: '10'
    }
  ])
})
