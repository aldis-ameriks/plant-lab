import React, { useState } from 'react';
import styled from 'styled-components';
import Info from './components/Info';
import InfoToggle from './components/InfoToggle';
import LineChart from './components/LineChart';
import RadialChart from './components/RadialChart';
import DataProvider from './DataProvider';
import plantImg from './plant.jpg';

const CardWrapper = styled.div`
  margin: 2em 0;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  position: relative;
  box-shadow: 0px 15px 25px 0px rgba(0, 0, 0, 0.25);
  background-color: #ededed;
  width: 600px;
  border-radius: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transition: all 500ms ease;
  padding: 1em 0;

  @media (min-width: 500px) {
    padding: 1em;
  }

  @media (min-width: 1300px) {
    width: 1200px;
    height: 1250px;
  }
`;

const CardSection = styled.div`
  transition: all 500ms ease;
  width: 300px;

  @media (min-width: 500px) {
    width: 400px;
  }

  @media (min-width: 700px) {
    width: 600px;
  }
`;

const CardTitle = styled.h3`
  text-align: center;
`;

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  max-height: 150px;
  margin-top: 1rem;
  margin-bottom: 3rem;
`;

const GaugeWrapper = styled.div`
  width: 100%;
  min-width: 200px;
  max-width: 250px;
  margin: 0 -3em; // workaround to bring the apex chart gauges closer horizontally
`;

const LineChartsWrapper = styled.div`
  @media (max-width: 700px) {
    margin-left: -3em; // workaround for the excessive left space for apex charts in mobile layout
  }
`;

const ImageWrapper = styled.div`
  text-align: center;
`;

const Image = styled.img`
  width: 70%;
  @media (min-width: 1300px) {
    width: 80%;
  }
`;

const Reading = styled.div`
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  text-align: center;
  width: 210px;
  z-index: 10;
  //box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, 0.2);
  //box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;

  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const App = () => {
  const nodeId = getNodeId();
  const [isInfoVisible, setInfoVisibility] = useState(false);

  return (
    <CardWrapper>
      <DataProvider
        nodeId={nodeId}
        render={({
          moisture,
          temperature,
          batteryVoltage,
          daysSinceLastWatered,
          minutesSinceLastReading,
          currentReading,
        }) => (
          <Card>
            <InfoToggle isVisible={isInfoVisible} setVisibility={setInfoVisibility} />
            <Info isVisible={isInfoVisible} />
            <CardSection>
              <CardTitle>Rubber tree</CardTitle>
              <ImageWrapper>
                <Image src={plantImg} alt="" width="100%" />
              </ImageWrapper>

              <RowWrapper>
                <GaugeWrapper>
                  <RadialChart label="moisture" value={currentReading.moisture} type="percentage" />
                </GaugeWrapper>
                <GaugeWrapper>
                  <RadialChart
                    label="temp."
                    value={currentReading.temperature}
                    type="temperature"
                    maxValue={40}
                  />
                </GaugeWrapper>
                <GaugeWrapper>
                  <RadialChart
                    label="battery"
                    value={currentReading.batteryVoltage}
                    type="voltage"
                    maxValue={4.3}
                    minValue={2.8}
                    decimals={2}
                  />
                </GaugeWrapper>
              </RowWrapper>

              <RowWrapper>
                <Reading>Last reading {minutesSinceLastReading} min. ago</Reading>
                <Reading>Last watered {daysSinceLastWatered} days ago</Reading>
              </RowWrapper>
            </CardSection>

            <CardSection>
              <LineChartsWrapper>
                <LineChart data={moisture} title="Moisture" />
                <LineChart data={temperature} title="Temperature" />
                <LineChart min={2.8} max={4.3} data={batteryVoltage} title="Battery voltage" />
              </LineChartsWrapper>
            </CardSection>
          </Card>
        )}
      />
    </CardWrapper>
  );
};

function getNodeId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('nodeId') || undefined;
}

export default App;
