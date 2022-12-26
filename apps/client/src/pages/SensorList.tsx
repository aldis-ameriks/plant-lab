import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { SensorReadings } from 'components/SensorReadings';
import { Card, CardSection, CardWrapper, Header, Image, ImageWrapper, Title } from 'pages/SensorDetails';

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
  cursor: pointer;

  @media (min-width: 350px) {
    font-size: 0.8rem;
  }
`;

const ListCardSection = styled(CardSection)`
  > div {
    max-width: 350px;
  }

  @media (min-width: 700px) {
    display: flex;
  }
`;

export const SensorList = () => {
  const history = useHistory();
  return (
    <List>
      {deviceIds.map((id) => (
        <ListCardWrapper key={id}>
          <ListCard onClick={() => history.push(`/sensors/${id}`)}>
            <ListCardSection>
              <Header>
                <Title>
                  <h3>Rubber tree</h3>
                  <h5>sensor id: {id}</h5>
                </Title>

                <ImageWrapper>
                  <Image src="/plant.jpg" alt="" />
                </ImageWrapper>
              </Header>

              <SensorReadings deviceId={id} />
            </ListCardSection>
          </ListCard>
        </ListCardWrapper>
      ))}
    </List>
  );
};
