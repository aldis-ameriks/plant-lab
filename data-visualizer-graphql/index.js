const { ApolloServer, gql } = require('apollo-server');
const { find, filter } = require('lodash');
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

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    foo: 'bar'
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
];

const authors = [{ name: 'J.K. Rowling' }, { name: 'Michael Crichton' }];

const typeDefs = gql`
  scalar DateTime
  type Book {
    title: String
    author: Author
  }

  type Author {
    name: String
    books: [Book]
  }

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
    books: [Book]
    authors: [Author]
    readings: [Reading]
  }
`;

const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    books: () => books,
    authors: () => authors,
    readings: () => getReadings()
  },
  Author: {
    books: author => filter(books, { author: author.name })
  },
  Book: {
    author: book => find(authors, { name: book.author })
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
