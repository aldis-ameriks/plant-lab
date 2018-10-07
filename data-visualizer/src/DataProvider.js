import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

class DataProvider extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  };

  state = { data: null };

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.intervalId = setInterval(this.fetchData, 5000);
    this.fetchData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getFormattedTimeSinceLastReading(lastReadingTime) {
    const offsetInMilis = new Date() - lastReadingTime;
    const minutes = Math.floor((offsetInMilis / (1000 * 60)) % 60);
    const hours = Math.floor((offsetInMilis / (1000 * 60 * 60)) % 24);
    const days = Math.floor(offsetInMilis / (1000 * 60 * 60 * 24));
    return `${days} days ${hours} hours ${minutes} minutes`;
  }

  async fetchData() {
    const result = await axios.get('https://api.cleverhome.link/sensor?limit=200&nodeid=3');
    this.setState({ data: result.data });
  }

  render() {
    const { data } = this.state;
    if (!data) {
      return <CircularProgress style={{ display: 'block', margin: 'auto' }} />;
    }

    const orderedData = data.map(d => d.moisture_precentage).reverse();
    const labels = data.map(d => d.time).reverse();
    const lastReadingTime = new Date(data[0].time);

    const lastReadings = {
      moisture: Number(data[0].moisture_precentage).toFixed(2),
      temperature: data[0].temperature,
      time: lastReadingTime.toLocaleString(),
      timeSinceLastReading: this.getFormattedTimeSinceLastReading(lastReadingTime)
    };

    const { render } = this.props;
    return render({ data: orderedData, labels, lastReadings });
  }
}

export default DataProvider;
