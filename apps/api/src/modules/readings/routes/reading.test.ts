import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import { Context } from '../../../helpers/context'
import { device, user } from '../../../test-helpers/seeds'
import { setupRoutes } from '../../../test-helpers/setupRoutes'
import { DeviceEntity, UsersDeviceEntity } from '../../../types/entities'
import readingsRoutes from '../routes'
import * as seeds from '../../../test-helpers/seeds'

const route = setupRoutes(readingsRoutes)

let knex: Knex
let context: Context
let app: FastifyInstance

beforeEach(async () => {
  knex = route.knex
  context = route.context
  app = route.app

  await knex('user_access_keys')
    .update({ roles: ['HUB'] })
    .where('access_key', seeds.userAccessKey.access_key)
})

test('checks user auth', async () => {
  await knex('user_access_keys').update({ roles: [] }).where('access_key', seeds.userAccessKey.access_key)

  let res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain' },
    payload: 'body'
  })
  expect(res.body).toContain('Forbidden')
  expect(res.statusCode).toBe(403)

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
    payload: 'body'
  })
  expect(res.body).toContain('Forbidden')
  expect(res.statusCode).toBe(403)

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': 'unknown-key' },
    payload: 'body'
  })
  expect(res.body).toContain('Forbidden')
  expect(res.statusCode).toBe(403)

  await knex('user_access_keys')
    .update({ roles: ['HUB'] })
    .where('access_key', seeds.userAccessKey.access_key)

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
    payload: 'body'
  })
  expect(res.body).toContain('Invalid input')
  expect(res.statusCode).toBe(400)
})

test('validates payload', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
    payload: 'invalid payload'
  })
  expect(res.body).toEqual('Invalid input')
  expect(res.statusCode).toBe(400)
})

test('verifies that user owns device', async () => {
  await knex('users_devices').where('user_id', seeds.user.id).del()
  await knex('readings').where('device_id', seeds.device.id).del()
  const payload = '1;2;3;4;5;6;7;8;9;10;11'
  let res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
    payload
  })
  expect(res.statusCode).toBe(403)
  let readings = await knex('readings').where('device_id', seeds.device.id)
  expect(readings.length).toBe(0)

  await knex<UsersDeviceEntity>('users_devices').insert({ user_id: user.id, device_id: device.id })

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
    payload
  })
  expect(res.statusCode).toBe(200)
  readings = await knex('readings').where('device_id', seeds.device.id)
  expect(readings.length).toBe(1)
})

test('saves reading', async () => {
  await knex('readings').where('device_id', seeds.device.id).del()
  let payload = '1;2;3;4;5;6;7;8;9;10;11'
  let res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
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
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
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

test('updates device last seen at', async () => {
  await knex<DeviceEntity>('devices').update({ last_seen_at: null }).where('id', seeds.device.id)

  const payload = '1;2;3;4;5;6;7;8;9;10;11'

  let res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
    payload
  })
  expect(res.statusCode).toBe(200)

  let device = await knex<DeviceEntity>('devices').where('id', seeds.device.id).first()
  expect(device!.last_seen_at!).toBeTruthy()

  const past = new Date()
  past.setDate(past.getDate() - 30)

  await knex<DeviceEntity>('devices').update({ last_seen_at: past }).where('id', seeds.device.id)

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.access_key },
    payload
  })
  expect(res.statusCode).toBe(200)

  device = await knex<DeviceEntity>('devices').where('id', seeds.device.id).first()
  expect(new Date(device!.last_seen_at!) > past).toBeTruthy()
})
