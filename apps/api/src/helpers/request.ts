import http, { type IncomingHttpHeaders, type IncomingMessage, type OutgoingHttpHeaders } from 'node:http'
import https from 'node:https'

class RequestError extends Error {
  statusCode?: number
  response?: string
  headers?: OutgoingHttpHeaders

  constructor(message: string, statusCode?: number, response?: string, headers?: OutgoingHttpHeaders) {
    super(message)
    this.statusCode = statusCode
    this.response = response
    this.headers = headers
  }
}

type Method = 'GET' | 'POST'

type Options = {
  method?: Method
  body?: string
  headers?: OutgoingHttpHeaders
  timeout?: number
}

type Result = {
  data?: string
  headers: IncomingHttpHeaders
  statusCode: IncomingMessage['statusCode']
}

export function request(
  url: string,
  { method = 'GET', body = '', headers = {}, timeout = 30000 }: Options = {}
): Promise<Result> {
  const parsedUrl = new URL(url)
  const transport = parsedUrl.protocol === 'https:' ? https : http
  const opts = {
    method,
    host: parsedUrl.host,
    port: parsedUrl.port,
    path: `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`,
    headers: Object.assign({}, { 'content-length': Buffer.byteLength(body) }, headers)
  }

  return new Promise((resolve, reject) => {
    const req = transport.request(opts, (res) => {
      res.setEncoding('utf-8')

      /* node:coverage ignore next 3 */
      if (req.aborted) {
        return resolve({ data: undefined, headers: res.headers, statusCode: res.statusCode })
      }

      let data = ''

      /* node:coverage ignore next 6 */
      res.on('error', (err) => {
        if (req.aborted) {
          return resolve({ data: undefined, headers: res.headers, statusCode: res.statusCode })
        }
        reject(new RequestError(err.message))
      })

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          reject(new RequestError(`request (${url}) failed (${res.statusCode})`, res.statusCode, data, res.headers))
        } else {
          resolve({ data, statusCode: res.statusCode, headers: res.headers })
        }
      })
    })

    req.on('error', (err) => {
      reject(new RequestError(err.message))
    })

    req.setTimeout(timeout, () => {
      req.once('error', () => {})
      req.abort()
      reject(new RequestError('request timeout'))
    })

    req.end(body)
  })
}
