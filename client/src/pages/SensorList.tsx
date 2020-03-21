import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SensorReadings from '../components/SensorReadings';
import { Card, CardSection, CardWrapper, Image, ImageWrapper } from './SensorDetails';

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
    max-height: 250px;
  }
`;

const ListImage = styled(Image)`
  @media (min-width: 700px) {
    width: 90%;
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
                <ListImage src="/plant.jpg" alt="" width="100%" />
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
