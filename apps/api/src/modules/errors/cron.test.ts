import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import nock from 'nock'
import { Context } from '../../helpers/context'
import { errors } from '../../helpers/schema'
import { getTestContext } from '../../test-helpers/getTestContext'
import { run } from './cron'

const getContext = getTestContext()

beforeEach(async () => {
  context = getContext()
})

let source
let context: Context

beforeEach(async () => {
  source = randomUUID()
  context.config.telegram.receiver = 'tg-receiver'
  context.config.telegram.accessKey = 'tg-access-key'
  await context.db.delete(errors)
})

test('no errors', async () => {
  await context.db.delete(errors)
  await run(context)
})

test('more than 5 errors and missing tg receiver', async () => {
  context.config.telegram.receiver = ''

  await context.db.insert(errors).values([
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source }
  ])
  await run(context)
  const res = await context.db.query.errors.findMany({ where: eq(errors.source, source) })
  expect(res.length).toBe(7)
  for (const error of res) {
    expect(error.sentAt).toBeTruthy()
  }
})

test('more than 5 errors and missing tg access key', async () => {
  context.config.telegram.accessKey = ''

  await context.db.insert(errors).values([
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source }
  ])
  await run(context)
  const res = await context.db.query.errors.findMany({ where: eq(errors.source, source) })
  expect(res.length).toBe(7)

  for (const error of res) {
    expect(error.sentAt).toBeTruthy()
  }
})

test('more than 5 errors', async () => {
  const scope = nock(`https://api.telegram.org`)
    .post(`/bot${context.config.telegram.accessKey}/sendMessage`, {
      chat_id: context.config.telegram.receiver,
      text: `[${context.config.env}]: there are 7 errors`
    })
    .reply(200)

  await context.db.insert(errors).values([
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source }
  ])
  await run(context)
  scope.done()
  const res = await context.db.query.errors.findMany({ where: eq(errors.source, source) })
  expect(res.length).toBe(7)

  for (const error of res) {
    expect(error.sentAt).toBeTruthy()
  }
})

test('less than 5 errors', async () => {
  const scope = nock(`https://api.telegram.org`)
    .post(`/bot${context.config.telegram.accessKey}/sendMessage`, {
      chat_id: context.config.telegram.receiver,
      text: `[${source}-${context.config.env}]: {}`
    })
    .times(3)
    .reply(200)

  await context.db.insert(errors).values([
    { content: {}, source },
    { content: {}, source },
    { content: {}, source }
  ])
  await run(context)
  scope.done()
  const res = await context.db.query.errors.findMany({ where: eq(errors.source, source) })
  expect(res.length).toBe(3)
  for (const error of res) {
    expect(error.sentAt).toBeTruthy()
  }
})

test('unknown error source', async () => {
  const scope = nock(`https://api.telegram.org`)
    .post(`/bot${context.config.telegram.accessKey}/sendMessage`, {
      chat_id: context.config.telegram.receiver,
      text: `[unknown-${context.config.env}]: {}`
    })
    .times(3)
    .reply(200)

  await context.db.insert(errors).values([
    { content: {}, source: undefined },
    { content: {}, source: undefined },
    { content: {}, source: undefined }
  ])
  await run(context)
  scope.done()
  const res = await context.db.query.errors.findMany()
  expect(res.length).toBe(3)
  for (const error of res) {
    expect(error.sentAt).toBeTruthy()
  }
})
