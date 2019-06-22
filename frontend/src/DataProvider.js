import { differenceInDays, differenceInMinutes, subDays } from 'date-fns';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { ema } from 'moving-averages';

const query = gql`
  query($nodeid: Int, $date: DateTime) {
    readings(nodeid: $nodeid, date: $date) {
      readings {
        time
        moisture
        temperature
        batteryVoltage
      }
      watered
    }
  }
`;

const DataProvider = ({ date, nodeid, render }) => (
  <Query pollInterval={30000} variables={{ date, nodeid }} query={query}>
    {({ loading, error, data }) => {
      if (loading) {
        return null;
      }

      if (error) {
        return <p>Error loading sensor data.</p>;
      }

      const {
        readings: { readings, watered },
      } = data;
      if (!readings || readings.length < 1) {
        return <p>No readings for a long time. Check your sensors.</p>;
      }

      const moistures = readings.map(reading => reading.moisture);
      const temperatures = readings.map(reading => reading.temperature);
      const batteryVoltages = readings.map(reading => reading.batteryVoltage);
      const labels = readings.map(reading => new Date(reading.time).toLocaleDateString());
      const currentReading = readings[readings.length - 1];
      const daysSinceLastWatered = watered ? differenceInDays(new Date(), new Date(watered)) : null;
      const minutesSinceLastReading = differenceInMinutes(new Date(), currentReading.time);
      const temperatureTrend = ema(temperatures, temperatures.length / 2).map(value =>
        value.toFixed()
      );
      const moistureTrend = ema(moistures, moistures.length / 2).map(value => value.toFixed());
      const batteryVoltageTrend = ema(batteryVoltages, batteryVoltages.length / 2).map(value =>
        value.toFixed(2)
      );

      return render({
        moistures,
        temperatures,
        batteryVoltages,
        temperatureTrend,
        moistureTrend,
        batteryVoltageTrend,
        labels,
        currentReading,
        minutesSinceLastReading,
        daysSinceLastWatered,
      });
    }}
  </Query>
);

DataProvider.propTypes = {
  render: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  nodeid: PropTypes.number,
};

DataProvider.defaultProps = {
  nodeid: 4,
  date: subDays(new Date(), 90),
};

export default DataProvider;
