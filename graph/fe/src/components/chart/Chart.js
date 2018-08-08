import React from 'react';
import ApexCharts from 'apexcharts';

class Chart extends React.Component {
  componentDidMount() {
    const options = {
      chart: {
        type: 'line'
      },
      series: [
        {
          name: 'sales',
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }
      ],
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    };

    const chart = new ApexCharts(document.querySelector('#chart'), options);

    chart.render();
  }

  render() {
    return <div id="chart" />;
  }
}

export default Chart;
