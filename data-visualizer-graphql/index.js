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

const saveReading = async reading => {
  const item = {
    measurement: 'plant',
    tags: { nodeid: reading.nodeid, type: reading.type },
    time: new Date().toISOString(),
    fields: reading
  };
  await client.writePoints([item]);
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
  }

  type Query {
    readings: [Reading]
  }
`;

const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    readings: () => getReadings()
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
