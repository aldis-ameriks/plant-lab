import { randomUUID } from 'crypto'
import { Knex } from 'knex'
import nock from 'nock'
import { getTestContext } from '../../test-helpers/getTestContext'
import { ErrorEntity } from '../../types/entities'
import { run } from './cron'

const getContext = getTestContext()
let knex: Knex

beforeEach(async () => {
  context = getContext()
  knex = context.knex
})

let source
let context

beforeEach(async () => {
  source = randomUUID()
  context.config.telegram.receiver = 'tg-receiver'
  context.config.telegram.accessKey = 'tg-access-key'
  await knex('errors').del()
})

test('no errors', async () => {
  await knex('errors').del()
  await run(context)
})

test('more than 5 errors and missing tg receiver', async () => {
  context.config.telegram.receiver = ''

  await knex<ErrorEntity>('errors').insert([
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source }
  ])
  await run(context)
  const res = await knex<ErrorEntity>('errors').where('source', source)
  expect(res.length).toBe(7)
  for (const error of res) {
    expect(error.sent_at).toBeTruthy()
  }
})

test('more than 5 errors and missing tg access key', async () => {
  context.config.telegram.accessKey = ''

  await knex<ErrorEntity>('errors').insert([
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source },
    { content: {}, source }
  ])
  await run(context)
  const res = await knex<ErrorEntity>('errors').where('source', source)
  expect(res.length).toBe(7)

  for (const error of res) {
    expect(error.sent_at).toBeTruthy()
  }
})

test('more than 5 errors', async () => {
  const scope = nock(`https://api.telegram.org`)
    .post(`/bot${context.config.telegram.accessKey}/sendMessage`, {
      chat_id: context.config.telegram.receiver,
      text: `[${context.config.env}]: there are 7 errors`
    })
    .reply(200)

  await knex<ErrorEntity>('errors').insert([
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
  const res = await knex<ErrorEntity>('errors').where('source', source)
  expect(res.length).toBe(7)

  for (const error of res) {
    expect(error.sent_at).toBeTruthy()
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

  await knex<ErrorEntity>('errors').insert([
    { content: {}, source },
    { content: {}, source },
    { content: {}, source }
  ])
  await run(context)
  scope.done()
  const res = await knex<ErrorEntity>('errors').where('source', source)
  expect(res.length).toBe(3)
  for (const error of res) {
    expect(error.sent_at).toBeTruthy()
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

  await knex<ErrorEntity>('errors').insert([
    { content: {}, source: undefined },
    { content: {}, source: undefined },
    { content: {}, source: undefined }
  ])
  await run(context)
  scope.done()
  const res = await knex<ErrorEntity>('errors')
  expect(res.length).toBe(3)
  for (const error of res) {
    expect(error.sent_at).toBeTruthy()
  }
})
