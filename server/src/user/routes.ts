import { FastifyInstance } from 'fastify';

import { jsonSchema } from 'common/jsonSchema';

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
          400: jsonSchema.BaseError,
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
