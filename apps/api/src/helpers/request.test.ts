import assert from 'node:assert/strict'
import { test } from 'node:test'
import nock from 'nock'
import { request } from './request.ts'

test('defaults to get request', async () => {
  nock('http://request:1234').get('/').reply(200, { foo: 'bar' })
  const result = await request('http://request:1234')
  assert.equal(result.data, JSON.stringify({ foo: 'bar' }))
  assert.equal(result.statusCode, 200)
})

test('success - get json response', async () => {
  nock('http://request:1234').get('/').reply(200, { foo: 'bar' })
  const result = await request('http://request:1234', { method: 'GET' })
  assert.equal(result.data, JSON.stringify({ foo: 'bar' }))
  assert.equal(result.statusCode, 200)
})

test('success - get https json response', async () => {
  nock('https://request:1234').get('/').reply(200, { foo: 'bar' })
  const result = await request('https://request:1234', { method: 'GET' })
  assert.equal(result.data, JSON.stringify({ foo: 'bar' }))
  assert.equal(result.statusCode, 200)
})

test('success - get text response', async () => {
  nock('http://request:1234').get('/').reply(200, 'foo')
  const result = await request('http://request:1234', { method: 'GET' })
  assert.equal(result.data, 'foo')
  assert.equal(result.statusCode, 200)
})

test('success - post json response', async () => {
  nock('http://request:1234').post('/').reply(200, { foo: 'bar' })
  const result = await request('http://request:1234', { method: 'POST' })
  assert.equal(result.data, JSON.stringify({ foo: 'bar' }))
  assert.equal(result.statusCode, 200)
})

test('success - post json body, json response', async () => {
  nock('http://request:1234').post('/', { foo: 'bar' }).reply(200, { foo: 'bar' })
  const result = await request('http://request:1234', { method: 'POST', body: JSON.stringify({ foo: 'bar' }) })
  assert.equal(result.data, JSON.stringify({ foo: 'bar' }))
  assert.equal(result.statusCode, 200)
})

test('timeout', async () => {
  nock('http://request:1234').get('/').delay(100).reply(200, { foo: 'bar' })
  try {
    await request('http://request:1234', { method: 'GET', timeout: 10 })
    assert.fail('should have thrown')
  } catch (e) {
    assert.equal(e.message, 'request timeout')
  }
})

test('error', async () => {
  try {
    await request('http://request:1234', { method: 'GET', timeout: 10 })
    assert.fail('should have thrown')
  } catch (e) {
    assert.ok(e.message)
    assert.notEqual(e.message, 'should have thrown')
  }
})

test('unsuccessful status code', async () => {
  nock('http://request:1234').get('/').reply(400, { foo: 'bar' })
  try {
    await request('http://request:1234', { method: 'GET' })
    assert.fail('should have thrown')
  } catch (e) {
    assert.equal(e.message, 'request (http://request:1234) failed (400)')
  }
})

// todo:
// test('aborted', async () => {})
