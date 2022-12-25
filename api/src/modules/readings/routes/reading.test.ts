import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import { Context } from '../../../helpers/context'
import { setupRoutes } from '../../../test-helpers/setupRoutes'
import readingsRoutes from '../routes'
import * as seeds from '../../../test-helpers/seeds'

const route = setupRoutes(readingsRoutes)

let knex: Knex
let context: Context
let app: FastifyInstance

beforeEach(() => {
  knex = route.knex
  context = route.context
  app = route.app
})

// TODO: Add user auth
test('checks user auth', async () => {
  //
})

test('validates that body must be a string', async () => {
  const res = await app.inject({ method: 'POST', path: '/readings', payload: {} })
  expect(res.body).toContain('body must be string')
  expect(res.statusCode).toBe(400)
})

test('validates payload', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/readings',
    headers: { 'content-type': 'text/plain' },
    payload: 'invalid payload'
  })
  expect(res.body).toEqual('Invalid input')
  expect(res.statusCode).toBe(400)
})

// TODO: Add user devices
test('verifies that user owns device', async () => {
  //
})

test('saves reading', async () => {
  await knex('readings').where('device_id', seeds.device.id).del()
  let payload = '1;2;3;4;5;6;7;8;9;10;11'
  let res = await app.inject({
    method: 'POST',
    path: '/readings',
    headers: { 'content-type': 'text/plain' },
    payload
  })
  expect(res.statusCode).toBe(200)

  let readings = await knex('readings').where('device_id', seeds.device.id)
  expect(readings.length).toBe(1)
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

  payload = '1;22;33;44;55;66;77;88;99;1010;1111'
  res = await app.inject({
    method: 'POST',
    path: '/readings',
    headers: { 'content-type': 'text/plain' },
    payload
  })
  expect(res.statusCode).toBe(200)

  readings = await knex('readings').where('device_id', seeds.device.id)
  expect(readings.length).toBe(2)
  expect(readings).toMatchObject([
    {
      device_id: seeds.device.id,
      moisture_raw: '22',
      moisture: '33',
      moisture_min: '44',
      moisture_max: '55',
      temperature: '66',
      light: '77',
      battery_voltage: '88',
      signal: '99',
      reading_id: '1010'
    },
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
