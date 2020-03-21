import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SensorReadings from '../components/SensorReadings';
import { Card, CardSection, CardWrapper, ImageWrapper } from './SensorDetails';

const deviceIds = ['5', '6', '7'];

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ListCardWrapper = styled(CardWrapper)`
  margin: 2rem 3rem;
  max-width: 600px;
`;

const ListCard = styled(Card)`
  font-size: 0.7rem;
  width: auto;
  cursor: pointer;

  @media (min-width: 350px) {
    font-size: 0.8rem;
  }
`;

const MiniCardSection = styled(CardSection)`
  > div {
    max-width: 400px;
  }

  @media (min-width: 700px) {
    display: flex;
    max-height: 180px;
  }
`;

const ListImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('/plant.jpg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 200px;

  @media (min-width: 700px) {
    min-height: 130px;
  }
`;

const SensorList = () => {
  const history = useHistory();
  return (
    <List>
      {deviceIds.map(id => (
        <ListCardWrapper key={id}>
          <ListCard onClick={() => history.push(`/sensors/${id}`)}>
            <MiniCardSection>
              <ImageWrapper>
                <h3>Rubber tree</h3>
                <ListImage />
              </ImageWrapper>
              <SensorReadings deviceId={id} />
            </MiniCardSection>
          </ListCard>
        </ListCardWrapper>
      ))}
    </List>
  );
};

export default SensorList;
