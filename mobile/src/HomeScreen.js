import React from 'react';
import { Alert, Text, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components';
import DataProvider from './DataProvider';
import ChartScreen from './ChartScreen';

// const Container = styled.View`
//   flex: 1;
//   background-color: #eeeeee;
//   align-items: center;
//   justify-content: center;
//   padding-top: 50px;
// `;

const Container = styled.ScrollView.attrs(props => ({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    marginTop: -50,
    backgroundColor: '#eeeeee',
    flex: 1
  }
}))``;

const Heading = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const CardContainer = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.View`
  background-color: white;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  margin: 10px;
`;

const CardIcon = styled.Image`
  opacity: 0.8;
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  ${props =>
    props.smaller &&
    `
    width: 35px;
    height: 35px;
  `};
`;

const PlantImage = styled.Image`
  width: 400px;
  height: 400px;
  margin-bottom: 20px;
`;

const navigateToChartScreen = (navigator, title, data, labels) =>
  navigator.push({
    component: ChartScreen,
    title,
    navigationBarHidden: false,
    passProps: { data, labels }
  });

const HomeScreen = ({ navigator }) => (
  <Container scrollEnabled={false}>
    <Heading>Zamioculcas Zamifolia</Heading>
    <PlantImage source={require('../assets/plant.jpg')} />
    <CardContainer>
      <DataProvider
        render={({
          moistures,
          temperatures,
          labels,
          lastReadings: { moisture, temperature, minutesSinceLastReading }
        }) => (
          <React.Fragment>
            <TouchableWithoutFeedback
              onPress={() => navigateToChartScreen(navigator, 'Humidity', moistures, labels)}
            >
              <Card>
                <CardIcon source={require('../assets/water-droplet.png')} />
                <Text>{moisture}%</Text>
                <Text>humidity</Text>
              </Card>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => navigateToChartScreen(navigator, 'Temperature', temperatures, labels)}
            >
              <Card>
                <CardIcon source={require('../assets/temperature.png')} />
                <Text>{temperature}</Text>
                <Text>temperature</Text>
              </Card>
            </TouchableWithoutFeedback>
            <Card>
              <CardIcon source={require('../assets/sunlight.png')} />
              <Text>low</Text>
              <Text>sunlight</Text>
            </Card>
            <Card>
              <CardIcon source={require('../assets/clock.png')} smaller />
              <Text>last reading</Text>
              <Text>{minutesSinceLastReading} min. ago</Text>
            </Card>
            <Card>
              <CardIcon source={require('../assets/watercan.png')} />
              <Text>watered</Text>
              <Text>4 days ago</Text>
            </Card>
          </React.Fragment>
        )}
      />
    </CardContainer>
  </Container>
);

export default HomeScreen;
