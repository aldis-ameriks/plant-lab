import { FastifyInstance } from 'fastify';

import { validate } from 'common/validate';
import { DeviceService } from 'devices/service';
import { ReadingInput } from 'readings/models';
import { ReadingService } from 'readings/service';

export function readingsRoutes(fastify: FastifyInstance, opts, done) {
  const deviceService = new DeviceService();
  const readingService = new ReadingService();

  fastify.post(
    '/reading',
    {
      preHandler: async (req, reply) => {
        if (!req.context.user || !req.context.user.roles.includes('HUB')) {
          reply.code(403).type('text/plain').send('Forbidden');
        }
      },
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
          403: {
            type: 'string',
          },
        },
        headers: {
          type: 'object',
          properties: {
            'access-key': { type: 'string' },
          },
          required: ['access-key'],
        },
      },
    },
    async (req, reply) => {
      req.log.info('Received input:', req.body);
      const parsedInput = req.body.split(';');
      const device_id = parsedInput[0];
      const moisture_raw = Number(parsedInput[1]);
      const moisture = Number(parsedInput[2]);
      const moisture_min = Number(parsedInput[3]);
      const moisture_max = Number(parsedInput[4]);
      const temperature = Number(parsedInput[5]);
      const light = Number(parsedInput[6]) || null; // Some of the devices have their light sensor covered and send 0
      const battery_voltage = Number(parsedInput[7]);
      const signal = Number(parsedInput[8]);
      const reading_id = Number(parsedInput[9]) || 100;
      const firmware = `${Number(parsedInput[10])}`;

      const readingInput = new ReadingInput();
      readingInput.device_id = device_id;
      readingInput.reading_id = reading_id;
      readingInput.moisture = moisture;
      readingInput.moisture_raw = moisture_raw;
      readingInput.moisture_min = moisture_min;
      readingInput.moisture_max = moisture_max;
      readingInput.temperature = temperature;
      readingInput.battery_voltage = battery_voltage;
      readingInput.light = light;
      readingInput.signal = signal;
      readingInput.firmware = firmware;

      try {
        await validate(readingInput);
      } catch (e) {
        reply.code(400).send('Invalid input');
      }

      const userId = req.context.user.id;
      await deviceService.verifyUserOwnsDevice(device_id, userId);
      await readingService.saveReading(readingInput);

      return reply.send('success');
    }
  );
  done();
}
