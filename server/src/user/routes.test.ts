import 'reflect-metadata';
import fastify, { FastifyInstance } from 'fastify';
import { Container } from 'typedi';

import { ForbiddenError } from 'common/errors/ForbiddenError';

import { userRoutes } from 'user/routes';
import { UserService } from 'user/service';

describe('user routes', () => {
  const accessKey = 'access-key';

  let app: FastifyInstance;
  let userServiceMock;
  let validateAccessKeyMock: jest.Mock;

  beforeAll(async () => {
    validateAccessKeyMock = jest.fn();
    userServiceMock = { validateAccessKey: validateAccessKeyMock };
    Container.set(UserService, userServiceMock);

    app = fastify();
    app.register(userRoutes);
  });

  describe('login', () => {
    describe('with empty body', () => {
      it('returns 400', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/login',
        });
        expect(response.statusCode).toBe(400);
      });
    });

    describe('with access key being too long', () => {
      it('returns 400', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/login',
          payload: {
            accessKey: 'x'.repeat(300),
          },
        });
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).error).toBe('Bad Request');
      });
    });

    describe('with invalid access key', () => {
      beforeEach(() => {
        validateAccessKeyMock.mockRejectedValue(new ForbiddenError());
      });

      it('returns 403', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/login',
          payload: {
            accessKey: 'x'.repeat(100),
          },
        });

        expect(response.statusCode).toBe(403);
        expect(JSON.parse(response.body).error).toBe('Forbidden');
      });
    });

    describe('with valid access key', () => {
      beforeEach(() => {
        validateAccessKeyMock.mockReturnValue(accessKey);
      });

      it('returns given access key', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/login',
          payload: {
            accessKey,
          },
        });

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).accessKey).toBe(accessKey);
      });
    });
  });
});
