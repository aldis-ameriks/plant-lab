import React, { Component } from 'react'
import Chart from './chart/Chart'
import fetch from 'isomorphic-fetch'
import moment from 'moment'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { moistureValues: [], temperatureValues: [], lightValues: [], labels: [] }
  }

  render () {
    return (
      <div>
        <Chart legend='Moisture' values={this.state.moistureValues} labels={this.state.labels} />
        <Chart legend='Temperature' values={this.state.temperatureValues} labels={this.state.labels} />
        <Chart legend='Light' values={this.state.lightValues} labels={this.state.labels} />
      </div>
    )
  }

  fetchNewData () {
    fetch('http://localhost:3001/sensor/data?count=500')
      .then(response => response.json())
      .then(dataArray => {
        const moistureValues = dataArray.map(data => data.moisture_precentage)
        const temperatureValues = dataArray.map(data => data.temperature)
        const lightValues = dataArray.map(data => data.light)
        const labels = dataArray.map(data => parseDate(data.date))
        this.setState({ moistureValues, temperatureValues, lightValues, labels })
      })
      .catch(err => console.log(err))
  }

  componentDidMount () {
    this.interval = setInterval(this.fetchNewData.bind(this), 10000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }
}

const parseDate = dateString => moment(dateString).format('DD.MM.YYYY HH:mm')

export default App
