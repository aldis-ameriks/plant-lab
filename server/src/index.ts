import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import { buildSchema } from 'type-graphql';

import { authChecker } from 'common/authChecker';
import { createRequestContext } from 'common/helpers/createRequestContext';
import { shutdown } from 'common/helpers/shutdown';
import { DeviceResolver } from 'devices/resolver';
import { ReadingResolver } from 'readings/resolver';

(async () => {
  const schema = await buildSchema({
    authChecker,
    resolvers: [ReadingResolver, DeviceResolver],
    emitSchemaFile: {
      path: `${__dirname}/../schema.graphql`,
      commentDescriptions: true,
    },
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
    logger: true,
  });

  app.decorateRequest('context', {});
  app.addHook('preHandler', async (req) => {
    req.context = await createRequestContext(req.headers);
  });

  app.head('/', async () => 'hi');
  app.get('/ping', async () => 'pong');

  app.register(apolloServer.createHandler({ path: '/graphql' }));
  const address = await app.listen(process.env.SERVER_PORT ? +process.env.SERVER_PORT : 4000, '0.0.0.0');
  console.log(`Server started, listening on ${address} for incoming requests.`);
  console.log('Using environment:', process.env.NODE_ENV);

  await shutdown(app.close);
})();
