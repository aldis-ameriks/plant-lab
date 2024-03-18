import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { Context } from '../../helpers/context'
import { readings, userAccessKeys, usersDevices } from '../../helpers/schema'
import * as seeds from '../../test-helpers/seeds'
import { setupGraphql } from '../../test-helpers/setupGraphql'

const gql = setupGraphql()

let app: FastifyInstance
let context: Context

beforeEach(async () => {
  app = gql.app
  context = gql.context

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
    headers: { 'x-access-key': seeds.userAccessKey.accessKey },
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
    headers: { 'x-access-key': seeds.userAccessKey.accessKey },
    payload: { query }
  })
  const parsedBody = JSON.parse(result.body)
  expect(parsedBody.data).toBeNull()
  expect(parsedBody.errors[0].message).toBe('Invalid input')
})

test('verifies user owns device', async () => {
  await context.db.delete(usersDevices).where(eq(usersDevices.userId, seeds.user.id!))
  const input = '1;2;3;4;5;6;7;8;9;10;11'
  const query = `mutation { saveReading(input: "${input}") }`

  let result = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: { 'x-access-key': seeds.userAccessKey.accessKey },
    payload: { query }
  })
  let parsedBody = JSON.parse(result.body)
  expect(parsedBody.data).toBeNull()
  expect(parsedBody.errors[0].message).toBe('Forbidden')

  await context.db.insert(usersDevices).values({
    userId: seeds.user.id!,
    deviceId: seeds.device.id!
  })

  result = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: { 'x-access-key': seeds.userAccessKey.accessKey },
    payload: { query }
  })
  parsedBody = JSON.parse(result.body)
  expect(parsedBody).toEqual({ data: { saveReading: 'success' } })
})

test('saves reading', async () => {
  await context.db.delete(readings).where(eq(readings.deviceId, seeds.device.id!))
  const input = '1;2;3;4;5;6;7;8;9;10;11'
  const query = `mutation { saveReading(input: "${input}") }`

  let result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })

  expect(result.length).toBe(0)

  const result2 = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: { 'x-access-key': seeds.userAccessKey.accessKey },
    payload: { query }
  })
  const parsedBody = JSON.parse(result2.body)
  expect(parsedBody).toEqual({ data: { saveReading: 'success' } })

  result = await context.db.query.readings.findMany({ where: eq(readings.deviceId, seeds.device.id!) })
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
})
