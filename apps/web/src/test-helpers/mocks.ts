import { setupWorker, SetupWorker } from 'msw/browser'

export const handlers = []

let worker: SetupWorker

export const setupMockWorkers = (): SetupWorker => {
  if (!worker) {
    worker = setupWorker(...handlers)
  }
  worker.start()
  return worker
}
