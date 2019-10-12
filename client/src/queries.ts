import gql from 'graphql-tag';

gql`
  query Readings($nodeId: String!, $date: String!) {
    readings(nodeId: $nodeId, date: $date) {
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
