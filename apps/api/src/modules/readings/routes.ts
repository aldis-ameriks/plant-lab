import type { FastifyInstance } from 'fastify'
import reading from './routes/reading.ts'

export default async function readingsRoutes(fastify: FastifyInstance) {
  reading(fastify)
}
