import React from 'react';
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
        },
        legend: {
          show: true,
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

export default LineChart;
