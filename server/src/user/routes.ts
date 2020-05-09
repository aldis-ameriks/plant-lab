import { FastifyInstance } from 'fastify';

import { UserService } from 'user/service';

export function userRoutes(fastify: FastifyInstance, opts, done) {
  const userService = new UserService();

  fastify.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            accessKey: { type: 'string', maxLength: 256 },
          },
          required: ['accessKey'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              accessKey: { type: 'string' },
            },
            required: ['accessKey'],
          },
          400: {
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['statusCode', 'error', 'message'],
          },
        },
      },
    },
    async (req, reply) => {
      const { accessKey } = req.body;
      await userService.validateAccessKey(accessKey);
      reply.send({ accessKey });
    }
  );

  done();
}
