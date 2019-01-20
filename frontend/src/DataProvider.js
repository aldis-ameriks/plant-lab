import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { differenceInMinutes, differenceInDays, subDays } from 'date-fns';

const getFormattedTimeSinceLastReading = lastReadingTime => {
  const minutes = differenceInMinutes(new Date(), lastReadingTime);
  const formattedTime = `${minutes} minutes ago`;
  if (minutes > 60) {
    return `${formattedTime} 😰`;
  }
  return formattedTime;
};

const query = gql`
  query($nodeid: Int, $date: DateTime) {
    readings(nodeid: $nodeid, date: $date) {
      readings {
        time
        humidity
        temperature
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
        return <p>Error :(</p>;
      }

      const {
        readings: { readings, watered },
      } = data;
      if (!readings || readings.length < 1) {
        return <p>No readings for past 7 days.</p>;
      }

      const moistures = readings.map(reading => reading.humidity);
      const temperatures = readings.map(reading => reading.temperature);
      const labels = readings.map(reading => reading.time);
      const lastReadingTime = new Date(readings[readings.length - 1].time);

      const lastReadings = {
        moisture: readings[0].humidity,
        temperature: readings[0].temperature,
        time: lastReadingTime.toLocaleString(),
        timeSinceLastReading: getFormattedTimeSinceLastReading(lastReadingTime),
      };

      return render({
        moistures,
        temperatures,
        labels,
        lastReadings,
        watered: differenceInDays(new Date(), new Date(watered)),
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
  nodeid: 3,
  date: subDays(new Date(), 30),
};

export default DataProvider;
