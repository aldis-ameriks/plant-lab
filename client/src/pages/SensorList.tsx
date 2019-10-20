import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SensorReadings from '../components/SensorReadings';
import { Card, CardSection, CardWrapper } from './SensorDetails';

const sensorIds = ['4', '999'];

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  > div {
    margin: 2rem;
  }
`;

const MiniCard = styled(Card)`
  font-size: 0.7rem;
  align-items: center;
  padding: 1em 2em 2em 1em;
  width: auto;
  cursor: pointer;

  @media (min-width: 350px) {
    font-size: 0.8rem;
  }
  @media (min-width: 1300px) {
    width: 600px;
    height: auto;
  }
`;

const MiniCardSection = styled(CardSection)`
  width: 240px;

  @media (min-width: 350px) {
    width: 290px;
  }

  @media (min-width: 500px) {
    width: 350px;
  }
  @media (min-width: 700px) {
    width: 350px;
  }
`;

const ImageWrapper = styled.div`
  text-align: center;
  width: 200px;
`;

const SensorList = () => {
  const history = useHistory();
  return (
    <List>
      {sensorIds.map(id => (
        <CardWrapper key={id}>
          <MiniCard onClick={() => history.push(`/sensors/${id}`)}>
            <ImageWrapper>
              <img src="/plant.jpg" alt="" width="100%" />
              <div>Rubber tree</div>
              <div>Node ID: {id}</div>
            </ImageWrapper>
            <MiniCardSection>
              <SensorReadings nodeId={id} />
            </MiniCardSection>
          </MiniCard>
        </CardWrapper>
      ))}
    </List>
  );
};

export default SensorList;
