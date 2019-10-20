import gql from 'graphql-tag';

gql`
  query Readings($nodeIds: [String!]!, $date: String) {
    readings(nodeIds: $nodeIds, date: $date) {
      node_id
      time
      moisture
      temperature
      light
      battery_voltage
    }
  }
`;

gql`
  query LastReading($nodeId: String!) {
    lastReading(nodeId: $nodeId) {
      node_id
      time
      moisture
      temperature
      light
      battery_voltage
    }
  }
`;

gql`
  query LastWateredTime($nodeId: String!) {
    lastWateredTime(nodeId: $nodeId)
  }
`;
