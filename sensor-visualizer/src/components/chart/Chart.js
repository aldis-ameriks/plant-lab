import React from 'react';
import PropTypes from 'prop-types';
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
  pointHitRadius: 10
};

const options = {
  scales: {
    xAxes: [
      {
        ticks: {
          display: false
        }
      }
    ]
  }
};

class Chart extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  };

  render() {
    const { labels, data } = this.props;
    const dataset = { labels, datasets: [{ label: 'Moisture', ...chartConfig, data }] };
    return <Line data={dataset} options={options} />;
  }
}

export default Chart;
