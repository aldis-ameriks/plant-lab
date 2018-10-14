import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const getFormattedTimeSinceLastReading = lastReadingTime => {
  // TODO: use date-fns
  const offsetInMilis = new Date() - lastReadingTime;
  const minutes = Math.floor((offsetInMilis / (1000 * 60)) % 60);
  const hours = Math.floor((offsetInMilis / (1000 * 60 * 60)) % 24);
  const days = Math.floor(offsetInMilis / (1000 * 60 * 60 * 24));
  return `${days} days ${hours} hours ${minutes} minutes`;
};

const DataProvider = ({ render }) => (
  <Query
    pollInterval={30000}
    query={gql`
      {
        readings(nodeid: 3, limit: 200) {
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
        return <CircularProgress style={{ display: 'block', margin: 'auto' }} />;
      }
      if (error) {
        return <p>Error :(</p>;
      }

      const { readings } = data;
      const orderedData = readings.map(d => d.moisture_precentage).reverse();
      const labels = readings.map(d => d.time).reverse();
      const lastReadingTime = new Date(readings[0].time);

      const lastReadings = {
        moisture: Number(readings[0].moisture_precentage).toFixed(2),
        temperature: readings[0].temperature,
        time: lastReadingTime.toLocaleString(),
        timeSinceLastReading: getFormattedTimeSinceLastReading(lastReadingTime)
      };

      return render({ data: orderedData, labels, lastReadings });
    }}
  </Query>
);

DataProvider.propTypes = {
  render: PropTypes.func.isRequired
};

export default DataProvider;
