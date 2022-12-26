export function throttle<T>(fn: () => T, wait: number): () => T | void {
  let time = Date.now()
  let fired = false
  return function () {
    if (!fired) {
      // We're not throttling the first fn call
      fired = true
      return fn()
    }

    if (time + wait - Date.now() < 0) {
      time = Date.now()
      return fn()
    }
  }
}
