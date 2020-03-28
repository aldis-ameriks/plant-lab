import { GraphQLServer, Options } from 'graphql-yoga';
import { defaultErrorFormatter } from 'graphql-yoga/dist/defaultErrorFormatter';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { authChecker } from './common/authChecker';
import { ACCESS_KEY } from './common/config';
import { getUserByAccessKey } from './common/helpers/getUserByAccessKey';
import { DeviceResolver } from './devices/resolver';
import { ReadingResolver } from './readings/resolver';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require('morgan');

(async () => {
  const schema = await buildSchema({
    authChecker,
    resolvers: [ReadingResolver, DeviceResolver],
    emitSchemaFile: {
      path: `${__dirname}/../schema.graphql`,
      commentDescriptions: true,
    },
  });

  const options = {
    port: process.env.SERVER_PORT || 4000,
    endpoint: '/graphql',
    formatError: err => {
      console.error(err);
      return defaultErrorFormatter(err);
    },
  };

  const server = new GraphQLServer({
    schema,
    context: async ({ request }) => {
      const accessKeyHeader = request.headers['access-key'];
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
  });

  server.express.use(morgan('short'));

  await server.start(options, ({ port }: Options) => {
    console.log(`Server started, listening on port ${port} for incoming requests.`);
    console.log('Using environment:', process.env.NODE_ENV);
  });
})();
