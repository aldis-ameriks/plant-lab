const { ApolloServer, gql } = require('apollo-server-lambda');
const { GraphQLDateTime } = require('graphql-iso-date');
const { ALLOWED_ORIGINS } = require('./config');
const SensorService = require('./SensorService');

const typeDefs = gql`
  scalar DateTime

  type Reading {
    time: DateTime
    humidity: Int
    temperature: Int
  }

  type Query {
    readings(nodeid: Int, date: DateTime): [Reading]
  }
`;

const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    readings: (obj, { nodeid, date }) => SensorService.getReadings(nodeid, date),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const handler = server.createHandler({
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
});

module.exports = handler;
