import React from 'react';
import { Line, defaults } from 'react-chartjs-2';
import { chartConfig } from './ChartConfig';

defaults.global.animation = false;

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { labels: [], datasets: [{ label: 'Moisture sensor', ...chartConfig, data: [] }] }
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.fetchNewData.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchNewData() {
    fetch('http://localhost:3001/sensor/data?count=1000')
      .then(response => response.json())
      .then(this.updateChart.bind(this))
      .catch(err => console.log(err));
  }

  updateChart(data) {
    let state = this.state.data;
    state.datasets[0].data = data.map(d => d.precentage);
    state.labels = data.map(d => d.date);
    this.setState({ data: state });
  }

  render() {
    return <Line data={this.state.data} redraw={true} />;
  }
}

export default Chart;
