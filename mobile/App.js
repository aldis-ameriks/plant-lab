import React from 'react';
import { Text } from 'react-native';
import DataProvider from './src/DataProvider';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import styled from 'styled-components';

const client = new ApolloClient({
  uri: 'https://api.cleverhome.link/graphql',
});

const Container = styled.View`
  flex: 1;
  background-color: #EEEEEE;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
`;

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
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  ${props => props.smaller && `
    width: 35px;
    height: 35px;
  `}
`;

const PlantImage = styled.Image`
  width: 400px;
  height: 400px;
  margin-bottom: 20px;
`;

export default class App extends React.Component {
  render() {
    return (
      <Container>
        <ApolloProvider client={client}>
          <Heading>Zamioculcas Zamifolia</Heading>
          <PlantImage source={require('./assets/plant.jpg')} />
          <CardContainer>
            <DataProvider
              render={({ moistures, temperatures, labels, lastReadings: { moisture, temperature, minutesSinceLastReading } }) => (
                <>
                  <Card>
                    <CardIcon source={require('./assets/water-droplet.png')} />
                    <Text>{moisture}%</Text>
                    <Text>humidity</Text>
                  </Card>
                  <Card>
                    <CardIcon source={require('./assets/temperature.png')} />
                    <Text>{temperature}</Text>
                    <Text>temperature</Text>
                  </Card>
                  <Card>
                    <CardIcon source={require('./assets/sunlight.png')} />
                    <Text>low</Text>
                    <Text>sunlight</Text>
                  </Card>
                  <Card>
                    <CardIcon source={require('./assets/clock.png')} smaller />
                    <Text>last reading</Text>
                    <Text>{minutesSinceLastReading} min. ago</Text>
                  </Card>
                  <Card>
                    <CardIcon source={require('./assets/watercan.png')} />
                    <Text>watered</Text>
                    <Text>4 days ago</Text>
                  </Card>
                </>
              )}
            />
          </CardContainer>
        </ApolloProvider>
      </Container>
    );
  }
}
