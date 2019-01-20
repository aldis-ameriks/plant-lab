import React from 'react';
import { Text, Dimensions } from 'react-native';
import styled from 'styled-components';
import { LineChart } from 'react-native-chart-kit';

const Container = styled.View`
  flex: 1;
  background-color: #eeeeee;
  align-items: center;
  padding-top: 150px;
`;

class ChartScreen extends React.Component {
  // componentDidMount() {
  //   Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.LANDSCAPE_RIGHT);
  // }

  // componentWillUnmount() {
    // Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);
  // }

  render() {
    const {data, labels} = this.props;
    return (
      <Container>
        <Text>Chart data over last 30 days</Text>
        <LineChart
          data={{
            datasets: [
              {
                data
              }
            ]
          }}
          width={Dimensions.get('window').width}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </Container>
    );
  }
}

export default ChartScreen;
