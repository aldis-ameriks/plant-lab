import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { differenceInMinutes } from 'date-fns';

const getFormattedTimeSinceLastReading = lastReadingTime => {
  const minutes = differenceInMinutes(new Date(), lastReadingTime);
  const formattedTime = `${minutes} minutes ago`;
  if (minutes > 60) {
    return `${formattedTime} 😰`;
  }
  return formattedTime;
};

const DataProvider = ({ render }) => (
  <Query
    pollInterval={30000}
    query={gql`
      {
        readings(nodeid: 3, limit: 2000, every: 50) {
          nodeid
          time
          temperature
          moisture_precentage
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return null;
      }

      if (error) {
        return <p>Error :(</p>;
      }

      const { readings } = data;
      const moistures = readings.map(d => d.moisture_precentage).reverse();
      const temperatures = readings.map(d => d.temperature).reverse();
      const labels = readings.map(d => d.time).reverse();
      const lastReadingTime = new Date(readings[0].time);

      const lastReadings = {
        moisture: Number(readings[0].moisture_precentage).toFixed(2),
        temperature: readings[0].temperature,
        time: lastReadingTime.toLocaleString(),
        timeSinceLastReading: getFormattedTimeSinceLastReading(lastReadingTime),
      };

      return render({ moistures, temperatures, labels, lastReadings });
    }}
  </Query>
);

DataProvider.propTypes = {
  render: PropTypes.func.isRequired,
};

export default DataProvider;
