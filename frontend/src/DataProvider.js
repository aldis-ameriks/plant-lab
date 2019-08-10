import { differenceInDays, differenceInMinutes, subDays } from 'date-fns';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';

const query = gql`
  query($nodeId: String!, $date: String!) {
    readings(nodeId: $nodeId, date: $date) {
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

const DataProvider = ({ date, nodeId, render }) => (
  <Query pollInterval={30000} variables={{ date, nodeId }} query={query}>
    {({ loading, error, data }) => {
      if (loading) {
        return null;
      }

      if (error) {
        return <p>Error loading sensor data.</p>;
      }

      const {
        readings: { moisture, temperature, batteryVoltage, watered },
      } = data;
      if (!moisture || moisture.length < 1) {
        return <p>No readings for a long time. Check your sensors.</p>;
      }

      const currentReading = {
        time: moisture[moisture.length - 1].time,
        moisture: moisture[moisture.length - 1].value,
        temperature: temperature[temperature.length - 1].value,
        batteryVoltage: batteryVoltage[batteryVoltage.length - 1].value,
      };

      const daysSinceLastWatered = watered ? differenceInDays(new Date(), new Date(watered)) : null;
      const minutesSinceLastReading = differenceInMinutes(new Date(), currentReading.time);

      return render({
        moisture,
        temperature,
        batteryVoltage,
        currentReading,
        minutesSinceLastReading,
        daysSinceLastWatered,
      });
    }}
  </Query>
);

DataProvider.propTypes = {
  render: PropTypes.func.isRequired,
  date: PropTypes.string,
  nodeId: PropTypes.string,
};

DataProvider.defaultProps = {
  nodeId: '4',
  date: subDays(new Date(), 90).toISOString(),
};

export default DataProvider;
