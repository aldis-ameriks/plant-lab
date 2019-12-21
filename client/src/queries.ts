import gql from 'graphql-tag';

gql`
  query Readings($deviceId: String!, $date: String) {
    readings(deviceId: $deviceId, date: $date) {
      device_id
      time
      moisture
      temperature
      light
      battery_voltage
    }
  }
`;

gql`
  query LastReading($deviceId: String!) {
    lastReading(deviceId: $deviceId) {
      device_id
      time
      moisture
      temperature
      light
      battery_voltage
    }
  }
`;

gql`
  query LastWateredTime($deviceId: String!) {
    lastWateredTime(deviceId: $deviceId)
  }
`;
