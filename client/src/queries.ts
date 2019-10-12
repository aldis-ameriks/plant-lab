import gql from 'graphql-tag';

gql`
  query Readings($nodeIds: [String!]!, $date: String!) {
    readings(nodeIds: $nodeIds, date: $date) {
      id
      moisture {
        time
        value
      }
      temperature {
        time
        value
      }
      batteryVoltage {
        time
        value
      }
      watered
    }
  }
`;
