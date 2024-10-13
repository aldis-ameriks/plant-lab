import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import nock from 'nock'
import { type Context } from '../../helpers/context.ts'
import { errors } from '../../helpers/schema.ts'
import { getTestContext } from '../../test-helpers/getTestContext.ts'
import { run } from './cron.ts'

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
  assert.equal(res.length, 7)
  for (const error of res) {
    assert.ok(error.sentAt)
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
  assert.equal(res.length, 7)

  for (const error of res) {
    assert.ok(error.sentAt)
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
  assert.equal(res.length, 7)

  for (const error of res) {
    assert.ok(error.sentAt)
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
  assert.equal(res.length, 3)
  for (const error of res) {
    assert.ok(error.sentAt)
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
  assert.equal(res.length, 3)
  for (const error of res) {
    assert.ok(error.sentAt)
  }
})
