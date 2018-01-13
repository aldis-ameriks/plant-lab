import React from 'react'
import PropTypes from 'prop-types'
import { Line, defaults } from 'react-chartjs-2'
import { chartConfig } from './ChartConfig'
import styled from 'styled-components'

defaults.global.animation = false

const ChartContainer = styled.div`
  display: inline-block;
`

const Chart = ({ legend, values, labels }) => {
  const data = { labels: labels, datasets: [{ label: legend, ...chartConfig, data: values }] }
  return <ChartContainer><Line data={data} redraw width={600} height={400} /></ChartContainer>
}

Chart.propTypes = {
  legend: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired
}

export default Chart
