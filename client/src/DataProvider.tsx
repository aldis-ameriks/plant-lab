import { differenceInDays, differenceInMinutes, subDays } from 'date-fns';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { ema } from 'moving-averages';

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

const DataProvider = ({ date, nodeId, render }: any) => (
  <Query pollInterval={30000} variables={{ date, nodeId }} query={query}>
    {({ loading, error, data }: any) => {
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
      const minutesSinceLastReading = differenceInMinutes(
        new Date(),
        new Date(currentReading.time)
      );

      const temperatureValues = temperature.map((t: any) => t.value);
      const emaValues = ema(temperatureValues, temperatureValues.length / 2).map((value: any) =>
        Math.round(value)
      );
      const temperatureMovingAverage = emaValues
        .map((tr: any, index: number) => ({ time: temperature[index].time, value: tr }))
        .filter(Boolean);

      return render({
        moisture,
        temperature: temperatureMovingAverage,
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
