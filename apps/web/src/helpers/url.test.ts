import { removeQueryParam } from './url'

test('removeQueryParam', () => {
  let url = ''
  let result = removeQueryParam(url, '')
  expect(result).toBe(url)

  url = 'http://127.0.0.1'
  result = removeQueryParam(url, '')
  expect(result).toBe(url)

  url = '/'
  result = removeQueryParam(url, '')
  expect(result).toBe(url)

  url = '/?foo=bar'
  result = removeQueryParam(url, '')
  expect(result).toBe(url)

  url = '/path?foo=bar'
  result = removeQueryParam(url, '')
  expect(result).toBe(url)

  url = 'http://127.0.0.1/path?foo=bar'
  result = removeQueryParam(url, '')
  expect(result).toBe(url)

  url = 'http://127.0.0.1/path?'
  result = removeQueryParam(url, '')
  expect(result).toBe('http://127.0.0.1/path')

  url = 'http://127.0.0.1/path?foo=bar'
  result = removeQueryParam(url, 'bar')
  expect(result).toBe(url)

  url = 'http://127.0.0.1/path?foo=bar'
  result = removeQueryParam(url, 'foo')
  expect(result).toBe('http://127.0.0.1/path')

  url = 'http://127.0.0.1/path?foo=bar&p=2'
  result = removeQueryParam(url, 'foo')
  expect(result).toBe('http://127.0.0.1/path?p=2')

  url = '/path?foo=bar'
  result = removeQueryParam(url, 'foo')
  expect(result).toBe('/path')
})
