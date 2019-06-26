import { GraphQLServer, Options } from 'graphql-yoga';
import 'reflect-metadata';
import { defaultErrorFormatter } from 'graphql-yoga/dist/defaultErrorFormatter';
import { buildSchema } from 'type-graphql';
import { authChecker } from './common/authChecker';
import { ACCESS_KEY } from './common/config';

import ReadingResolver from './reading/ReadingResolver';

const morgan = require('morgan');

(async () => {
  const schema = await buildSchema({
    authChecker,
    resolvers: [ReadingResolver],
    emitSchemaFile: true,
  });

  const options = {
    port: 4000,
    endpoint: '/graphql',
    formatError: err => {
      console.error(err);
      return defaultErrorFormatter(err);
    },
  };

  const server = new GraphQLServer({
    schema,
    context: ({ request }) => {
      const accessKey = request.headers['access-key'];
      const isAuthorized = accessKey === ACCESS_KEY;
      return { isAuthorized };
    },
  });

  server.express.use(morgan('dev'));

  await server.start(options, ({ port }: Options) =>
    console.log(`Server started, listening on port ${port} for incoming requests.`)
  );
})();
