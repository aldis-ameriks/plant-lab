import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import { buildSchema } from 'type-graphql';

import { authChecker } from './common/authChecker';
import { ACCESS_KEY } from './common/config';
import { getUserByAccessKey } from './common/helpers/getUserByAccessKey';
import { DeviceResolver } from './devices/resolver';
import { ReadingResolver } from './readings/resolver';

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
    context: async ({ headers }) => {
      const accessKeyHeader = headers['access-key'];
      let accessKey = Array.isArray(accessKeyHeader) ? accessKeyHeader[0] : accessKeyHeader;

      if (!accessKey && ACCESS_KEY) {
        accessKey = ACCESS_KEY;
      }

      if (!accessKey) {
        return { user: undefined };
      }

      const user = await getUserByAccessKey(accessKey);
      return { user };
    },
    formatError: (err) => {
      console.error(err);
      return err;
    },
  });

  const app = fastify({
    logger: true,
  });

  app.register(apolloServer.createHandler({ path: '/graphql' }));
  const host = await app.listen(process.env.SERVER_PORT ? +process.env.SERVER_PORT : 4000);
  console.log(`Server started, listening on ${host} for incoming requests.`);
  console.log('Using environment:', process.env.NODE_ENV);
})();
