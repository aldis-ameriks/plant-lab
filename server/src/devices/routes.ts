import { FastifyInstance } from 'fastify';

import { knex } from 'common/db';
import { DeviceStatus } from 'devices/models';

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
      console.log('discover request', deviceId);

      const isTaken = await knex('users_devices')
        .select('user_id')
        .innerJoin('devices', 'devices.id', 'users_devices.device_id')
        .where('device_id', deviceId)
        .andWhere('status', DeviceStatus.paired)
        .first();

      if (isTaken) {
        // Have to remove device from app first to enable re-pairing
        console.error('device that is already paired tried to discover itself');
        return reply.code(400).send('failed');
      }

      const device = await knex('devices').select('id', 'status').where('id', deviceId).first();
      if (!device) {
        console.error('unknown device tried to discover itself, deviceId:', deviceId);
        return reply.code(400).send('failed');
      }

      if (device.status === DeviceStatus.pairing) {
        const accessKey = await knex('users_access_keys')
          .select('access_key')
          .innerJoin('users_devices', 'users_devices.user_id', 'users_access_keys.user_id')
          .whereRaw("'HUB' = ANY(roles)")
          .andWhere('users_devices.device_id', deviceId)
          .first();

        if (accessKey) {
          console.log('successfully paired device, returning access key');
          return reply.send(accessKey.access_key);
        }
      }

      const address = req.context.isLocal ? '127.0.0.1' : req.ip;
      await knex('devices')
        .update({ address, last_seen_at: new Date(), status: DeviceStatus.pairing })
        .where('id', deviceId);
      return reply.send('success');
    }
  );

  fastify.post(
    '/confirm-pairing',
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
      console.log('pairing confirm request', req.body);
      if (!req.context.user) {
        return reply.code(400).send('failed');
      }

      const device = await knex('devices')
        .innerJoin('users_devices', 'users_devices.device_id', 'devices.id')
        .where('users_devices.user_id', req.context.user.id)
        .andWhere('devices.id', req.body)
        .first();

      if (!device) {
        return reply.code(400).send('failed');
      }

      const deviceId = req.body;
      await knex('devices').update('status', DeviceStatus.paired).where('id', deviceId);
      return reply.send('success');
    }
  );

  done();
}
