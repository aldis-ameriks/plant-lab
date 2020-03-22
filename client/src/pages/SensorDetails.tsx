import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import Info from '../components/Info';
import InfoToggle from '../components/InfoToggle';
import LineChart from '../components/LineChart';
import { useReadingsQuery } from '../graphql';
import SensorReadings from '../components/SensorReadings';
import { LeftArrow } from '../components/LeftArrow';

export const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem;
`;

export const Card = styled.div`
  position: relative;
  box-shadow: 0px 15px 25px 0px rgba(0, 0, 0, 0.25);
  background-color: #ededed;
  border-radius: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transition: all 500ms ease;
  padding: 1em 2em 2em 2em;
  font-size: 0.7rem;
  width: auto;

  @media (min-width: 350px) {
    font-size: 0.8rem;
  }

  @media (min-width: 700px) {
    width: 600px;
    font-size: 1rem;
  }

  @media (min-width: 1350px) {
    width: 1200px;
  }
`;

export const CardSection = styled.div`
  transition: all 500ms ease;
  width: 240px;

  @media (min-width: 350px) {
    width: 290px;
  }

  @media (min-width: 500px) {
    width: 350px;
  }

  @media (min-width: 700px) {
    width: 600px;
  }
`;

const LineChartsWrapper = styled.div`
  @media (max-width: 700px) {
    margin-left: -3em; // workaround for the excessive left space for apex charts in mobile layout
  }
`;

export const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const BackLinkWrapper = styled(Link)`
  position: absolute;
  cursor: pointer;
  top: 5px;
  left: 10px;
  z-index: 3000;
  background-color: transparent;
  padding: 0.5em;
  font-size: 1.5em;
  border: 3px solid transparent;
`;

export const Title = styled.div`
  text-align: center;

  h3 {
    margin-bottom: 0;
    margin-top: 0.5rem;
  }

  h5 {
    margin-top: 0;
    margin-bottom: 0.8rem;
  }
`;

export const Header = styled.div`
  width: 80%;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

export const ImageWrapper = styled.div`
  max-width: 100%;
  max-height: 100%;

  @media (min-width: 700px) {
    max-width: 70%;
    max-height: 70%;
    margin: auto;
  }
`;

const SensorDetails = () => {
  const { id = '4' } = useParams();
  const [isInfoVisible, setInfoVisibility] = useState(false);
  const { data, loading, error } = useReadingsQuery({ variables: { deviceId: id } });

  if (loading) {
    return null;
  }

  if (error) {
    return <p>Error loading sensor data: {error.message}</p>;
  }

  if (!data || !data.readings) {
    return <p>No readings. Check your sensors.</p>;
  }

  const { readings } = data;

  return (
    <CardWrapper>
      <Card>
        <BackLinkWrapper to="/">
          <LeftArrow color="#8c8c8d" />
        </BackLinkWrapper>

        <InfoToggle isVisible={isInfoVisible} setVisibility={setInfoVisibility} />
        <Info isVisible={isInfoVisible} />

        <CardSection>
          <div>
            <Title>
              <h3>Rubber tree</h3>
              <h5>sensor id: {id}</h5>
            </Title>

            <ImageWrapper>
              <Image src="/plant.jpg" alt="" />
            </ImageWrapper>
          </div>
          <SensorReadings deviceId={id} />
        </CardSection>

        <CardSection>
          <LineChartsWrapper>
            <LineChart data={readings} title="Moisture" field="moisture" />
            <LineChart data={readings} title="Average Temperature" field="temperature" />
            <LineChart min={2.0} max={4.3} data={readings} title="Battery voltage" field="battery_voltage" />
          </LineChartsWrapper>
        </CardSection>
      </Card>
    </CardWrapper>
  );
};

export default SensorDetails;
