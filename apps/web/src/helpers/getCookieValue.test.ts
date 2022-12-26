import { getCookieValue } from './getCookieValue'

describe('getCookieValue', () => {
  test('returns value with single cookie', () => {
    Object.defineProperty(document, 'cookie', {
      get: jest.fn().mockImplementation(() => 'foo=bar; _ga=GA1.1.1208532040.1595094090; foo2=bar2'),
      configurable: true
    })
    const res = getCookieValue('_ga')
    expect(res).toBe('GA1.1.1208532040.1595094090')
  })

  test('returns value with multiple cookies', () => {
    Object.defineProperty(document, 'cookie', {
      get: jest.fn().mockImplementation(() => 'foo=bar; _ga=GA1.1.1208532040.1595094090; foo2=bar2'),
      configurable: true
    })
    const res = getCookieValue('_ga')
    expect(res).toBe('GA1.1.1208532040.1595094090')
  })

  test('returns empty when cookie is not found', () => {
    Object.defineProperty(document, 'cookie', {
      get: jest.fn().mockImplementation(() => ''),
      configurable: true
    })
    const res = getCookieValue('_ga')
    expect(res).toBe('')
  })

  test('returns empty when malformed cookie string', () => {
    Object.defineProperty(document, 'cookie', {
      get: jest.fn().mockImplementation(() => 'qwerty123'),
      configurable: true
    })
    const res = getCookieValue('_ga')
    expect(res).toBe('')
  })
})
