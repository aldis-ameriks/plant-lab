import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';

import { ForbiddenError } from 'common/errors/ForbiddenError';
import jsonSchema from 'common/jsonSchema-generated.json';
import { Notification, NotificationResponse } from 'notifications/models';
import { NotificationsService } from 'notifications/service';

export function notificationRoutes(fastify: FastifyInstance, opts, done) {
  const notificationsService = Container.get(NotificationsService);

  fastify.get(
    '/notifications/new',
    {
      preHandler: async (req) => {
        if (!req.ctx.user) {
          throw new ForbiddenError();
        }
      },
      schema: {
        response: {
          200: jsonSchema.NotificationResponse,
        },
      },
    },
    async (req, reply) => {
      const result = await notificationsService.getUnsentNotifications(req.ctx.user.id);
      const notifications = result.map((entry) => Notification.from(entry));
      const response = new NotificationResponse(notifications);
      reply.send(response);
    }
  );

  done();
}
