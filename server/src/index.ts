import { GraphQLServer, Options } from 'graphql-yoga';
import { defaultErrorFormatter } from 'graphql-yoga/dist/defaultErrorFormatter';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { authChecker } from './common/authChecker';
import { DeviceResolver } from './devices/DeviceResolver';
import { ReadingResolver } from './readings/ReadingResolver';

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
    context: ({ request }) => {
      const accessKeyHeader = request.headers['access-key'];
      const accessKey = Array.isArray(accessKeyHeader) ? accessKeyHeader[0] : accessKeyHeader;
      return { accessKey };
    },
  });

  server.express.use(morgan('combined'));

  await server.start(options, ({ port }: Options) => {
    console.log(`Server started, listening on port ${port} for incoming requests.`);
    console.log('Using environment:', process.env.NODE_ENV);
  });
})();
