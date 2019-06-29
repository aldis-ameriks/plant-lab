import React from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        colors: ['#8a8a8a', '#bbbbbb'],
        chart: {
          fontFamily: 'inherit',
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          colors: ['#8a8a8a', '#bbbbbb'],
          curve: 'smooth', // "smooth" / "straight" / "stepline"
          width: 3,
          // lineCap: 'square', // round, butt , square
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: this.props.categories,
          labels: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          min: this.props.min,
          max: this.props.max,
        },
        markers: {
          colors: ['#8a8a8a', '#bbbbbb'],
          strokeColor: '#999999',
        },
        tooltip: {
          enabled: true,
          marker: {
            show: false,
          },
        },
        title: {
          text: this.props.title,
          align: 'middle',
          offsetX: 14,
          offsetY: 24,
        },
        legend: {
          show: true,
          offsetY: -10,
          labels: {
            colors: ['#ffffff', '#000000'],
          },
        },
      },
      series: this.props.series,
    };
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="line"
        width="100%"
      />
    );
  }
}

LineChart.propTypes = {
  title: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    })
  ).isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

LineChart.defaultProps = {
  min: undefined,
  max: undefined,
};

export default LineChart;
