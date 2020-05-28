import 'reflect-metadata';
import fc from 'fast-check';
import fastify, { FastifyInstance } from 'fastify';
import { Container } from 'typedi';

import { ForbiddenError } from 'common/errors/ForbiddenError';
import { mockClassMethods } from 'common/test-helpers/mockClassMethods';
import { userRoutes } from 'user/routes';
import { UserService } from 'user/service';

describe('user routes', () => {
  let app: FastifyInstance;
  let userServiceMock: { [key in keyof UserService]: jest.Mock };

  beforeAll(async () => {
    userServiceMock = mockClassMethods(UserService);
    Container.set(UserService, userServiceMock);

    app = fastify();
    app.register(userRoutes);
  });

  describe('login', () => {
    test('validates input', async () => {
      let response = await app.inject({ method: 'POST', url: '/login' });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toBe('Bad Request');

      await fc.assert(
        await fc.asyncProperty(fc.string(257, 1000), async (text) => {
          response = await app.inject({ method: 'POST', url: '/login', payload: { accessKey: text } });
          expect(response.body).toContain('body.accessKey should NOT be longer than 256 characters');
          expect(response.statusCode).toBe(400);
          expect(JSON.parse(response.body).error).toBe('Bad Request');
        })
      );
    });

    test('prevents access with invalid access key', async () => {
      userServiceMock.validateAccessKey.mockRejectedValue(new ForbiddenError());
      const response = await app.inject({ method: 'POST', url: '/login', payload: { accessKey: 'xxx' } });
      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body).error).toBe('Forbidden');
    });

    test('allows access with valid access key', async () => {
      await fc.assert(
        await fc.asyncProperty(fc.string(0, 256), async (value) => {
          userServiceMock.validateAccessKey.mockReturnValue(value);
          const response = await app.inject({ method: 'POST', url: '/login', payload: { accessKey: value } });
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(response.body).accessKey).toBe(value);
        })
      );
    });
  });
});
