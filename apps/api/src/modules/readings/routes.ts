import { FastifyInstance } from 'fastify'
import reading from './routes/reading'

export default async function readingsRoutes(fastify: FastifyInstance) {
  reading(fastify)
}
