import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { authChecker } from 'common/authChecker';
import { isDevelopment } from 'common/config';
import { createRequestContext } from 'common/helpers/createRequestContext';
import { shutdown } from 'common/helpers/shutdown';
import { initJsonSchema } from 'common/jsonSchema';
import { DeviceResolver } from 'devices/resolver';
import { devicesRoutes } from 'devices/routes';
import { NotificationsCron } from 'notifications/cron';
import { NotificationsResolver } from 'notifications/resolver';
import { notificationRoutes } from 'notifications/routes';
import { ReadingResolver } from 'readings/resolver';
import { readingsRoutes } from 'readings/routes';
import { UserResolver } from 'user/resolver';
import { userRoutes } from 'user/routes';

(async () => {
  const schema = await buildSchema({
    authChecker,
    resolvers: [ReadingResolver, DeviceResolver, NotificationsResolver, UserResolver],
    emitSchemaFile: {
      path: `${__dirname}/../schema.graphql`,
      commentDescriptions: true,
    },
    container: Container,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: async (req) => req.context,
    formatError: (err) => {
      console.error(JSON.stringify(err));
      return err;
    },
  });

  const app = fastify({
    logger: {
      prettyPrint: isDevelopment
        ? {
            translateTime: true,
          }
        : false,
    },
  });

  Container.set('logger', app.log);

  initJsonSchema();
  Container.get(NotificationsCron).start();

  app.decorateRequest('context', {});
  app.addHook('preHandler', async (req) => {
    req.context = await createRequestContext(req.log, req.headers, req.ip, req.hostname);
  });

  app.head('/', async () => 'head');
  app.get('/ping', async () => 'pong');

  app.register(readingsRoutes);
  app.register(devicesRoutes);
  app.register(userRoutes);
  app.register(notificationRoutes);
  app.register(apolloServer.createHandler({ path: '/graphql' }));

  const address = await app.listen(process.env.SERVER_PORT ? +process.env.SERVER_PORT : 4000, '0.0.0.0');
  console.log(`Server started, listening on ${address} for incoming requests.`);
  console.log('Using environment:', process.env.NODE_ENV);

  await shutdown(app.close);
})();
