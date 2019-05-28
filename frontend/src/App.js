import React from 'react';
import styled from 'styled-components';
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
  box-shadow: 0px 15px 25px 0px rgba(0, 0, 0, 0.25);
  background-color: #ededed;
  max-width: 600px;
  border-radius: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transition: all 500ms ease;

  > div {
    transition: all 500ms ease;
    width: 300px;
  }

  @media (min-width: 500px) {
    padding: 1rem;

    > div {
      width: 400px;
    }
  }

  @media (min-width: 700px) {
    > div {
      width: 600px;
    }
  }

  @media (min-width: 1300px) {
    max-width: 1200px;
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

const App = () => (
  <CardWrapper>
    <DataProvider
      render={({
        moistures,
        temperatures,
        temperatureTrend,
        labels,
        daysSinceLastWatered,
        minutesSinceLastReading,
        currentReading: { moisture, temperature, time },
      }) => (
        <Card>
          <div>
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
          </div>

          <LineChartsWrapper>
            <LineChart x={labels} y={moistures} label="Moisture" />
            <LineChart x={labels} y={temperatures} label="Temperature" />
          </LineChartsWrapper>
        </Card>
      )}
    />
  </CardWrapper>
);

export default App;
