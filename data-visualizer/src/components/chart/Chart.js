import React from 'react';
import PropTypes from 'prop-types';
import ApexCharts from 'apexcharts';

class Chart extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      chart: null
    };
  }

  componentDidMount() {
    const chart = new ApexCharts(document.querySelector('#chart'), this.getChartOptions());
    chart.render();
    this.setState({ chart });
  }

  componentDidUpdate() {
    const { data, labels } = this.props;
    const { chart } = this.state;
    chart.updateSeries([{ data, name: 'moisture' }]);
    chart.updateOptions({ xaxis: { categories: labels } });
  }

  getChartOptions(data = [], categories = []) {
    return {
      chart: {
        type: 'line',
        animations: {
          dynamicAnimation: {
            enabled: false
          }
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          name: 'moisture',
          data
        }
      ],
      xaxis: {
        categories,
        labels: {
          show: false
        }
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      legend: {
        show: false
      }
    };
  }

  render() {
    return <div id="chart" />;
  }
}

export default Chart;
