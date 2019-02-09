import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components';
import DataProvider from './DataProvider';

const { width, height } = Dimensions.get('window');
const paddingTop = height / 16;
const cardSize = width / 4 + 5;
const iconSize = width / 10;
const plantImageSize = height / 2.3;

const Container = styled.View`
  flex: 1;
  background-color: #eeeeee;
  align-items: center;
  justify-content: center;
  padding-top: ${paddingTop}px;
`;

const Heading = styled.Text`
  font-size: ${width/18.75}px;
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
  height: ${cardSize}px;
  width: ${cardSize}px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  margin: 10px;
`;

const CardIcon = styled.Image`
  opacity: 0.8;
  width: ${iconSize}px;
  height: ${iconSize}px;
  margin-bottom: 5px;
  ${props =>
  props.smaller &&
  `
    width: ${iconSize -5}px;
    height: ${iconSize -5}px;
  `};
`;

const PlantImage = styled.Image`
  width: ${plantImageSize}px;
  height: ${plantImageSize}px;
  margin-bottom: 20px;
`;

const Text = styled.Text`
  font-size: ${width/26.78}px;
`;

const HomeScreen = () => (
  <Container>
    <Heading>Ficus carica</Heading>
    <PlantImage source={require('../assets/plant.jpg')} />
    <CardContainer>
      <DataProvider
        render={({
                   moistures,
                   temperatures,
                   labels,
                   lastWatered,
                   lastReadings: { moisture, temperature, minutesSinceLastReading },
                 }) => (
          <React.Fragment>
            <Card>
              <CardIcon source={require('../assets/water-droplet.png')} />
              <Text>{moisture}%</Text>
              <Text>humidity</Text>
            </Card>
            <Card>
              <CardIcon source={require('../assets/temperature.png')} />
              <Text>{temperature}</Text>
              <Text>temperature</Text>
            </Card>
            <Card>
              <CardIcon source={require('../assets/sunlight.png')} />
              <Text>low</Text>
              <Text>sunlight</Text>
            </Card>
            <Card>
              <CardIcon source={require('../assets/clock.png')} smaller />
              <Text>last reading</Text>
              <Text>{minutesSinceLastReading} min ago</Text>
            </Card>
            <Card>
              <CardIcon source={require('../assets/watercan.png')} />
              <Text>watered</Text>
              <Text>{lastWatered ? `${lastWatered} days ago` : 'long time ago'}</Text>
            </Card>
          </React.Fragment>
        )}
      />
    </CardContainer>
  </Container>
);

export default HomeScreen;
