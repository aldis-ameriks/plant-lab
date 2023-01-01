import { config } from './config'

let errors: Array<Record<string, unknown>> = []
let sending = false

export function captureError(err: unknown): void {
  if (config.captureErrors) {
    if (err instanceof Error) {
      errors.push({ error: err.toString() })
    } else {
      errors.push({ error: JSON.stringify(err) })
    }
    if (errors.length > 200) {
      flushErrors()
    }
  }
}

function flushErrors() {
  if (errors.length) {
    if (sending) {
      return
    }
    sending = true
    const body = JSON.stringify(errors)
    errors = []

    fetch(`${config.api.baseUrl}/error`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body
    })
      .catch(() => {})
      .finally(() => {
        sending = false
      })
  }
}

setInterval(() => {
  flushErrors()
}, 500)
