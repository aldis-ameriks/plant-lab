import gql from 'graphql-tag';

gql`
  query Readings($sensorId: String!, $date: String) {
    readings(sensorId: $sensorId, date: $date) {
      sensor_id
      time
      moisture
      temperature
      light
      battery_voltage
    }
  }
`;

gql`
  query LastReading($sensorId: String!) {
    lastReading(sensorId: $sensorId) {
      sensor_id
      time
      moisture
      temperature
      light
      battery_voltage
    }
  }
`;

gql`
  query LastWateredTime($sensorId: String!) {
    lastWateredTime(sensorId: $sensorId)
  }
`;
