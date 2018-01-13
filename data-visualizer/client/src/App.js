import React, { Component } from 'react'
import Chart from './chart/Chart'
import fetch from 'isomorphic-fetch'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { moisture: { values: [], labels: [] } }
  }

  render () {
    return (
      <div>
        <Chart legend='Moisture' values={this.state.moisture.values} labels={this.state.moisture.labels} />
        <Chart legend='Temperature' values={this.state.moisture.values} labels={this.state.moisture.labels} />
        <Chart legend='Light' values={this.state.moisture.values} labels={this.state.moisture.labels} />
      </div>
    )
  }

  fetchNewData () {
    fetch('http://localhost:3001/sensor/data?count=1000')
      .then(response => response.json())
      .then(data => {
        const values = data.map(d => d.precentage)
        const labels = data.map(d => d.date)
        this.setState({ moisture: { values: values, labels: labels } })
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

export default App
