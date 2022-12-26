import { gql } from '@apollo/client';

gql`
  query Readings($deviceId: ID!, $date: String) {
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
  query LastReading($deviceId: ID!) {
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
  query LastWateredTime($deviceId: ID!) {
    lastWateredTime(deviceId: $deviceId)
  }
`;
