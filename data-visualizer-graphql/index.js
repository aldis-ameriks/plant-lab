const { ApolloServer, gql } = require('apollo-server');
const Influx = require('influx');
const { GraphQLDateTime } = require('graphql-iso-date');

const { INFLUX_HOST, INFLUX_PORT, INFLUX_USER, INFLUX_PASSWORD } = process.env;

const client = new Influx.InfluxDB({
  host: INFLUX_HOST,
  database: 'plants',
  port: INFLUX_PORT,
  username: INFLUX_USER,
  password: INFLUX_PASSWORD,
  schema: [
    {
      measurement: 'plant',
      fields: {
        moisture: Influx.FieldType.INTEGER,
        m_wet: Influx.FieldType.INTEGER,
        m_dry: Influx.FieldType.INTEGER,
        temperature: Influx.FieldType.INTEGER,
        moisture_precentage: Influx.FieldType.FLOAT,
        nodeid: Influx.FieldType.INTEGER,
        type: Influx.FieldType.STRING
      },
      tags: ['nodeid', 'type']
    }
  ]
});

const saveReading = async input => {
  // Without copying the input object, influx client was failing with
  // TypeError: fields.hasOwnProperty is not a function
  const reading = { ...input };
  const time = new Date().toISOString();
  const item = {
    measurement: 'plant',
    tags: { nodeid: reading.nodeid, type: reading.type },
    time,
    fields: reading
  };
  await client.writePoints([item]);
  return {...reading, time};
};

const getReadings = (nodeid = 99, limit = 100) =>
  client.query(`select * from plant where nodeid=${nodeid} order by time desc limit ${limit}`);

const typeDefs = gql`
  scalar DateTime
  type Reading {
    time: DateTime
    m_dry: Int
    m_wet: Int
    moisture: Int
    moisture_precentage: Float
    nodeid: Int
    temperature: Int
    type: String
  }

  input ReadingInput {
    m_dry: Int
    m_wet: Int
    moisture: Int
    moisture_precentage: Float
    nodeid: Int
    temperature: Int
    type: String
  }

  type Mutation {
    addReading(reading: ReadingInput!): Reading
  }

  type Query {
    readings(nodeid: Int, limit: Int): [Reading]
  }
`;

const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    readings: (obj, { nodeid, limit }) => getReadings(nodeid, limit)
  },
  Mutation: {
    addReading: async (root, {reading}) => saveReading(reading)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
