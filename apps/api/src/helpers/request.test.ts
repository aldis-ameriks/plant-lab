import nock from 'nock'
import { request } from './request'

test('success - get json response', async () => {
  nock('http://request:1234').get('/').reply(200, { foo: 'bar' })
  const result = await request('http://request:1234', { method: 'GET' })
  expect(result.data).toBe(JSON.stringify({ foo: 'bar' }))
  expect(result.statusCode).toBe(200)
})

test('success - https', async () => {
  nock('https://request:1234').get('/').reply(200, { foo: 'bar' })
  const result = await request('https://request:1234', { method: 'GET' })
  expect(result.data).toBe(JSON.stringify({ foo: 'bar' }))
  expect(result.statusCode).toBe(200)
})

test('success - default args', async () => {
  nock('https://request:1234').get('/').reply(200, { foo: 'bar' })
  const result = await request('https://request:1234')
  expect(result.data).toBe(JSON.stringify({ foo: 'bar' }))
  expect(result.statusCode).toBe(200)
})

test('success - get text response', async () => {
  nock('http://request:1234').get('/').reply(200, 'foo')
  const result = await request('http://request:1234', { method: 'GET' })
  expect(result.data).toBe('foo')
  expect(result.statusCode).toBe(200)
})

test('success - post json response', async () => {
  nock('http://request:1234').post('/').reply(200, { foo: 'bar' })
  const result = await request('http://request:1234', { method: 'POST' })
  expect(result.data).toBe(JSON.stringify({ foo: 'bar' }))
  expect(result.statusCode).toBe(200)
})

test('success - post json body, json response', async () => {
  nock('http://request:1234').post('/', { foo: 'bar' }).reply(200, { foo: 'bar' })
  const result = await request('http://request:1234', { method: 'POST', body: JSON.stringify({ foo: 'bar' }) })
  expect(result.data).toBe(JSON.stringify({ foo: 'bar' }))
  expect(result.statusCode).toBe(200)
})

test('timeout', async () => {
  nock('http://request:1234').get('/').delay(100).reply(200, { foo: 'bar' })
  try {
    await request('http://request:1234', { method: 'GET', timeout: 10 })
    fail()
  } catch (e) {
    expect(e.message).toBe('request timeout')
  }
})

test('error', async () => {
  try {
    await request('http://request:1234', { method: 'GET', timeout: 10 })
    fail()
  } catch (e) {
    expect(e.message).toBeTruthy()
  }
})

test('unsuccessful status code', async () => {
  const url = 'http://request:1234'

  nock(url).get('/').reply(400, { foo: 'bar' })
  try {
    await request(url, { method: 'GET' })
    fail()
  } catch (e) {
    expect(e.message).toBe(`request (${url}) failed (400)`)
  }
})

// todo:
// test('aborted', async () => {})
