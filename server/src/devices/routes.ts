import { FastifyInstance } from 'fastify';

import { knex } from 'common/db';

export function devicesRoutes(fastify: FastifyInstance, opts, done) {
  fastify.post(
    '/discover',
    {
      schema: {
        body: {
          type: 'string',
        },
        response: {
          200: {
            type: 'string',
          },
          400: {
            type: 'string',
          },
        },
      },
    },
    async (req, reply) => {
      const deviceId = req.body;

      const isPaired = await knex('users_devices').select('user_id').where('device_id', deviceId).first();
      if (isPaired) {
        console.error('device that is already paired tried to discover itself');
        return reply.code(400).send('Device is already paired');
      }

      const device = await knex('devices').where('device_id', deviceId);
      if (!device) {
        console.error('unknown device tried to discover itself, deviceId:', deviceId);
        return reply.code(400).send('Device is already paired');
      }

      const address = req.ip;
      await knex('devices').update({ address, last_seen_at: new Date() }).where('device_id', deviceId);
      return reply.send('success');
    }
  );

  done();
}
