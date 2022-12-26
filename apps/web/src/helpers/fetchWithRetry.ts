import { captureError } from './captureError'

function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

export async function fetchWithRetry(input: RequestInfo, init?: RequestInit, retry = 0): Promise<Response> {
  try {
    return await fetch(input, init)
  } catch (e) {
    if (retry > 15) {
      captureError(e)
      throw e
    }
    await sleep(100 * retry)
    return fetchWithRetry(input, init, ++retry)
  }
}
