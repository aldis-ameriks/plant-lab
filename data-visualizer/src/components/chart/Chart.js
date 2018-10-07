import React from 'react';
import ApexCharts from 'apexcharts';
import axios from 'axios';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      data: null,
      chart: null
    };
  }

  componentDidMount() {
    setInterval(this.fetchData, 30000);
    const chart = new ApexCharts(document.querySelector('#chart'), this.getChartOptions());
    chart.render();
    this.setState({ chart });
    this.fetchData();
  }

  componentDidUpdate() {
    if (!this.state.data) {
      return;
    }
    const data = this.state.data.map(data => data.moisture_precentage).reverse();
    const categories = this.state.data.map(data => data.time).reverse();
    this.state.chart.updateSeries([{ data, name: 'moisture' }]);
    this.state.chart.updateOptions({ xaxis: { categories } });
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

  async fetchData() {
    const result = await axios.get('https://api.cleverhome.link/sensor?limit=200&nodeid=3');
    this.setState({ data: result.data });
  }

  render() {
    return <div id="chart" />;
  }
}

export default Chart;
