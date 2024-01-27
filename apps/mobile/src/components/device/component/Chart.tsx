import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

type Props = {
  labels: string[]
  data: number[]
  yAxisSuffix: string
}

export const Chart = ({ labels, data, yAxisSuffix }: Props) => (
  <LineChart
    data={{
      labels,
      datasets: [
        {
          data
        }
      ]
    }}
    width={Dimensions.get('window').width}
    height={220}
    yAxisSuffix={yAxisSuffix}
    yAxisInterval={1}
    formatXLabel={() => ''}
    chartConfig={{
      backgroundColor: 'white',
      backgroundGradientFrom: 'white',
      backgroundGradientTo: 'white',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForVerticalLabels: { fontFamily: 'Avenir' },
      propsForHorizontalLabels: { fontFamily: 'Avenir' },
      style: {
        borderRadius: 0
      },
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: 'black'
      }
    }}
    bezier
  />
)
