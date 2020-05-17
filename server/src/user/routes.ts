import { DefaultHeaders, DefaultParams, DefaultQuery, FastifyInstance } from 'fastify';

import { jsonSchema } from 'common/jsonSchema';
import { LoginInput, LoginResponse } from 'user/models';
import { UserService } from 'user/service';

export function userRoutes(fastify: FastifyInstance, opts, done) {
  const userService = new UserService();

  fastify.post<DefaultQuery, DefaultParams, DefaultHeaders, LoginInput>(
    '/login',
    {
      schema: {
        body: jsonSchema.LoginInput,
        response: {
          200: jsonSchema.LoginResponse,
          '4xx': jsonSchema.BaseError,
        },
      },
    },
    async (req, reply) => {
      const { accessKey } = req.body;
      await userService.validateAccessKey(accessKey);

      const response = new LoginResponse(accessKey);
      reply.send(response);
    }
  );

  done();
}
