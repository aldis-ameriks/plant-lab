import PropTypes from 'prop-types';
import React from 'react';
import { Line } from 'react-chartjs-2';

export const chartConfig = {
  fill: false,
  lineTension: 0.1,
  backgroundColor: 'rgba(32,156,238,0.4)',
  borderColor: 'rgba(32,156,238,1)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'rgba(32,156,238,1)',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(32,156,238,1)',
  pointHoverBorderColor: 'rgba(32,156,238,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
};

const options = {
  scales: {
    xAxes: [
      {
        ticks: {
          display: false,
        },
      },
    ],
  },
};

const Chart = ({ labels, data }) => {
  const datasets = data.map(dataEntry => ({ ...chartConfig, ...dataEntry }));
  return <Line data={{ labels, datasets }} options={options} />;
};

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default Chart;
