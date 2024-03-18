import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import assert from 'node:assert'
import { Context } from '../../../helpers/context'
import { devices, readings, userAccessKeys, usersDevices } from '../../../helpers/schema'
import * as seeds from '../../../test-helpers/seeds'
import { device, user } from '../../../test-helpers/seeds'
import { setupRoutes } from '../../../test-helpers/setupRoutes'
import readingsRoutes from '../routes'

const route = setupRoutes(readingsRoutes)

let app: FastifyInstance
let context: Context

beforeEach(async () => {
  context = route.context
  app = route.app

  await context.db
    .update(userAccessKeys)
    .set({ roles: ['HUB'] })
    .where(eq(userAccessKeys.accessKey, seeds.userAccessKey.accessKey))
})

test('checks user auth', async () => {
  await context.db
    .update(userAccessKeys)
    .set({ roles: [] })
    .where(eq(userAccessKeys.accessKey, seeds.userAccessKey.accessKey))

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
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
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

  await context.db
    .update(userAccessKeys)
    .set({ roles: ['HUB'] })
    .where(eq(userAccessKeys.accessKey, seeds.userAccessKey.accessKey))

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload: 'body'
  })
  expect(res.body).toContain('Invalid input')
  expect(res.statusCode).toBe(400)
})

test('validates payload', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload: 'invalid payload'
  })
  expect(res.body).toEqual('Invalid input')
  expect(res.statusCode).toBe(400)
})

test('verifies that user owns device', async () => {
  await context.db.delete(usersDevices).where(eq(usersDevices.userId, seeds.user.id!))
  await context.db.delete(readings).where(eq(readings.deviceId, seeds.device.id!))

  const payload = '1;2;3;4;5;6;7;8;9;10;11'
  let res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  expect(res.statusCode).toBe(403)
  let result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })

  expect(result.length).toBe(0)

  await context.db.insert(usersDevices).values({ userId: user.id!, deviceId: device.id! })

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  expect(res.statusCode).toBe(200)
  result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })
  expect(result.length).toBe(1)
})

test('saves reading', async () => {
  await context.db.delete(readings).where(eq(readings.deviceId, seeds.device.id!))

  let payload = '1;2;3;4;5;6;7;8;9;10;11'
  let res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  expect(res.statusCode).toBe(200)

  let result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })
  expect(result.length).toBe(1)
  expect(result).toMatchObject([
    {
      deviceId: seeds.device.id,
      moistureRaw: '2',
      moisture: '3',
      moistureMin: '4',
      moistureMax: '5',
      temperature: '6',
      light: '7',
      batteryVoltage: '8',
      signal: '9',
      readingId: '10'
    }
  ])

  payload = '1;22;33;44;55;66;77;88;99;1010;1111'
  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  expect(res.statusCode).toBe(200)

  result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })
  expect(result.length).toBe(2)
  expect(result).toMatchObject([
    {
      deviceId: seeds.device.id,
      moistureRaw: '2',
      moisture: '3',
      moistureMin: '4',
      moistureMax: '5',
      temperature: '6',
      light: '7',
      batteryVoltage: '8',
      signal: '9',
      readingId: '10'
    },
    {
      deviceId: seeds.device.id,
      moistureRaw: '22',
      moisture: '33',
      moistureMin: '44',
      moistureMax: '55',
      temperature: '66',
      light: '77',
      batteryVoltage: '88',
      signal: '99',
      readingId: '1010'
    }
  ])
})

test('updates device last seen at', async () => {
  await context.db.update(devices).set({ lastSeenAt: null }).where(eq(devices.id, seeds.device.id!))

  const payload = '1;2;3;4;5;6;7;8;9;10;11'

  let res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  expect(res.statusCode).toBe(200)

  let device = await context.db.query.devices.findFirst({ where: eq(devices.id, seeds.device.id!) })
  expect(device?.lastSeenAt).toBeTruthy()

  const past = new Date()
  past.setDate(past.getDate() - 30)

  await context.db.update(devices).set({ lastSeenAt: past }).where(eq(devices.id, seeds.device.id!))

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  expect(res.statusCode).toBe(200)

  device = await context.db.query.devices.findFirst({ where: eq(devices.id, seeds.device.id!) })
  assert.ok(device?.lastSeenAt)
  expect(new Date(device.lastSeenAt) > past).toBeTruthy()
})
