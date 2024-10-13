import { test, beforeEach } from 'node:test'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import assert from 'node:assert'
import { type Context } from '../../../helpers/context.ts'
import { devices, readings, userAccessKeys, usersDevices } from '../../../helpers/schema.ts'
import * as seeds from '../../../test-helpers/seeds.ts'
import { device, user } from '../../../test-helpers/seeds.ts'
import { setupRoutes } from '../../../test-helpers/setupRoutes.ts'
import readingsRoutes from '../routes.ts'

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
  assert.match(res.body, /Forbidden/)
  assert.equal(res.statusCode, 403)

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload: 'body'
  })
  assert.match(res.body, /Forbidden/)
  assert.equal(res.statusCode, 403)

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': 'unknown-key' },
    payload: 'body'
  })
  assert.match(res.body, /Forbidden/)
  assert.equal(res.statusCode, 403)

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
  assert.match(res.body, /Invalid input/)
  assert.equal(res.statusCode, 400)
})

test('validates payload', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload: 'invalid payload'
  })
  assert.match(res.body, /Invalid input/)
  assert.equal(res.statusCode, 400)
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
  assert.equal(res.statusCode, 403)
  let result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })

  assert.equal(result.length, 0)

  await context.db.insert(usersDevices).values({ userId: user.id!, deviceId: device.id! })

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  assert.equal(res.statusCode, 200)
  result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })
  assert.equal(result.length, 1)
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
  assert.equal(res.statusCode, 200)

  let result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })
  assert.equal(result.length, 1)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { time, ...data } = result[0]

  assert.deepEqual(data, {
    deviceId: seeds.device.id,
    moistureRaw: '2',
    moisture: '3',
    moistureMin: '4',
    moistureMax: '5',
    temperature: '6',
    light: '7',
    batteryVoltage: '8',
    signal: '9',
    readingId: '10',
    hubId: null
  })

  payload = '1;22;33;44;55;66;77;88;99;1010;1111'
  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  assert.equal(res.statusCode, 200)

  result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })
  assert.equal(result.length, 2)
  // expect(result).toMatchObject([
  //   {
  //     deviceId: seeds.device.id,
  //     moistureRaw: '2',
  //     moisture: '3',
  //     moistureMin: '4',
  //     moistureMax: '5',
  //     temperature: '6',
  //     light: '7',
  //     batteryVoltage: '8',
  //     signal: '9',
  //     readingId: '10'
  //   },
  //   {
  //     deviceId: seeds.device.id,
  //     moistureRaw: '22',
  //     moisture: '33',
  //     moistureMin: '44',
  //     moistureMax: '55',
  //     temperature: '66',
  //     light: '77',
  //     batteryVoltage: '88',
  //     signal: '99',
  //     readingId: '1010'
  //   }
  // ])
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
  assert.equal(res.statusCode, 200)

  let device = await context.db.query.devices.findFirst({ where: eq(devices.id, seeds.device.id!) })
  assert.ok(device?.lastSeenAt)

  const past = new Date()
  past.setDate(past.getDate() - 30)

  await context.db.update(devices).set({ lastSeenAt: past }).where(eq(devices.id, seeds.device.id!))

  res = await app.inject({
    method: 'POST',
    path: '/reading',
    headers: { 'content-type': 'text/plain', 'x-access-key': seeds.userAccessKey.accessKey },
    payload
  })
  assert.equal(res.statusCode, 200)

  device = await context.db.query.devices.findFirst({ where: eq(devices.id, seeds.device.id!) })
  assert.ok(device?.lastSeenAt)
  assert.ok(new Date(device.lastSeenAt) > past)
})
