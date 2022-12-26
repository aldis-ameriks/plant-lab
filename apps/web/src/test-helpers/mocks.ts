import { graphql, setupWorker, SetupWorkerApi } from 'msw'

export const handlers = []

let worker: SetupWorkerApi

export const setupMockWorkers = (): SetupWorkerApi => {
  if (!worker) {
    worker = setupWorker(...handlers)
  }
  worker.start()
  return worker
}
