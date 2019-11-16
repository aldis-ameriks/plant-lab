import gql from 'graphql-tag';

gql`
  query Readings($nodeId: String!, $date: String) {
    readings(nodeId: $nodeId, date: $date) {
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
