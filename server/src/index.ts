import { Request, Response } from 'express';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLServer, Options } from 'graphql-yoga';
import { getReadings, saveReading } from './sensor.service';

const morgan = require('morgan');

const typeDefs = `
  scalar DateTime

  type Reading {
    time: DateTime
    moisture: Int
    temperature: Int
    batteryVoltage: Float
  }

  type Readings {
    readings: [Reading]
    watered: DateTime
  }

  type Query {
    readings(nodeId: Int, date: DateTime): Readings
  }
`;

const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    readings: (obj, { nodeId, date }: { nodeId: string, date: string }) => getReadings(nodeId, date),
  },
};

const options = {
  port: 4000,
  endpoint: '/graphql',
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.express.use(morgan('dev'));

server.express.get('/sensor', async (req: Request, res: Response) => {
  const [
    nodeId, moisture, moisturePercentage, moistureDry, moistureWet, temperature, light, batteryVoltage,
  ] = req.query.data.split(';');
  await saveReading(nodeId, { moisturePercentage, temperature, batteryVoltage });
  res.send('OK');
});

server.start(options, ({ port }: Options) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`,
  ),
);


