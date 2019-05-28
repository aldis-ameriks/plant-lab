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
  padding-top: 1em;

  @media (min-width: 500px) {
    padding: 1em;
  }

  @media (min-width: 1300px) {
    width: 1200px;
    height: 880px;
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
  margin: 1rem 0;
`;

const GaugeWrapper = styled.div`
  width: 100%;
  min-width: 200px;
  max-width: 250px;
  margin: 0 -2em; // workaround to bring the apex chart gauges closer horizontally
`;

const LineChartsWrapper = styled.div`
  margin-left: -2em; // workaround for the excessive left space for apex charts
`;

const ImageWrapper = styled.div`
  text-align: center;
`;

const Reading = styled.div`
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  text-align: center;
  //box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, 0.2);

  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const App = () => {
  const [isInfoVisible, setInfoVisibility] = useState(true);

  return (
    <CardWrapper>
      <DataProvider
        render={({
          moistures,
          temperatures,
          moistureTrend,
          temperatureTrend,
          labels,
          daysSinceLastWatered,
          minutesSinceLastReading,
          currentReading: { moisture, temperature, time },
        }) => (
          <Card>
            <InfoToggle isVisible={isInfoVisible} setVisibility={setInfoVisibility} />
            <Info isVisible={isInfoVisible} />
            <CardSection>
              <CardTitle>Rubber tree</CardTitle>
              <ImageWrapper>
                <img src={plantImg} alt="" width="70%" />
              </ImageWrapper>

              <RowWrapper>
                <GaugeWrapper>
                  <RadialChart label="moisture" value={moisture} type="percentage" />
                </GaugeWrapper>
                <GaugeWrapper>
                  <RadialChart label="temp." value={temperature} type="temperature" />
                </GaugeWrapper>
              </RowWrapper>

              <RowWrapper>
                <Reading>Last reading {minutesSinceLastReading} min. ago</Reading>
                <Reading>Last watered {daysSinceLastWatered} days ago</Reading>
              </RowWrapper>
            </CardSection>

            <CardSection>
              <LineChartsWrapper>
                <LineChart
                  categories={labels}
                  series={[
                    { name: 'Moisture', data: moistures },
                    { name: 'Moisture moving average', data: moistureTrend },
                  ]}
                  title="Moisture"
                />
                <LineChart
                  categories={labels}
                  series={[
                    { name: 'Temperature', data: temperatures },
                    { name: 'Temperature moving average', data: temperatureTrend },
                  ]}
                  title="Temperature"
                />
              </LineChartsWrapper>
            </CardSection>
          </Card>
        )}
      />
    </CardWrapper>
  );
};

export default App;
