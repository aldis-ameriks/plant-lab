import { FastifyInstance } from 'fastify';

import { ForbiddenError } from 'common/errors/ForbiddenError';
import { jsonSchema } from 'common/jsonSchema';
import { NotificationResponse } from 'notifications/models';
import { NotificationsService } from 'notifications/service';

export function notificationRoutes(fastify: FastifyInstance, opts, done) {
  const notificationsService = new NotificationsService();

  fastify.get(
    '/notifications/new',
    {
      preHandler: async (req) => {
        if (!req.context.user) {
          throw new ForbiddenError('Forbidden');
        }
      },
      schema: {
        response: {
          200: jsonSchema.NotificationResponse,
        },
      },
    },
    async (req, reply) => {
      const notifications = await notificationsService.getUnsentNotifications(req.context.user.id);
      const response = new NotificationResponse(notifications);
      reply.send(response);
    }
  );

  done();
}
