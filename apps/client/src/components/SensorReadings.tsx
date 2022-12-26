import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import styled from 'styled-components';

import { RadialChart } from 'components/charts/RadialChart';
import { useLastReadingQuery, useLastWateredTimeQuery } from 'graphql-gen';

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  max-height: 100px;
  margin: 1rem 0;

  @media (min-width: 500px) {
    max-height: 120px;
  }

  @media (min-width: 700px) {
    max-height: 150px;
  }
`;

const GaugeWrapper = styled.div`
  width: 100%;
  max-width: 160px;
  margin: 0 -2em; // workaround to bring the apex chart gauges closer horizontally

  @media (min-width: 600px) {
    max-width: 200px;
  }

  // workaround to avoid cutting off label when resizing window
  min-height: 130px;
  svg {
    min-height: 130px;
  }
`;

const ReadingWrapper = styled.div`
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

type Props = {
  deviceId: string;
};

export const SensorReadings: React.FC<Props> = ({ deviceId }) => {
  const lastReadingQuery = useLastReadingQuery({ variables: { deviceId } });
  const lastWateredTimeQuery = useLastWateredTimeQuery({ variables: { deviceId } });

  if (lastReadingQuery.loading || lastWateredTimeQuery.loading) {
    return null;
  }

  if (lastReadingQuery.error || lastWateredTimeQuery.error) {
    return <div>Failed to fetch</div>;
  }

  if (!lastReadingQuery.data || !lastReadingQuery.data.lastReading) {
    return <div>No data</div>;
  }

  const { moisture, temperature, battery_voltage, time } = lastReadingQuery.data.lastReading;
  const lastReadingRelativeTime = formatDistanceToNow(new Date(time));

  return (
    <div>
      <RowWrapper>
        <GaugeWrapper>
          <RadialChart label="moisture" value={moisture} type="percentage" />
        </GaugeWrapper>
        <GaugeWrapper>
          <RadialChart label="temp." value={temperature} type="temperature" maxValue={40} decimals={1} />
        </GaugeWrapper>
        <GaugeWrapper>
          <RadialChart
            label="battery"
            value={battery_voltage}
            type="voltage"
            maxValue={4.3}
            minValue={2.8}
            decimals={2}
          />
        </GaugeWrapper>
      </RowWrapper>

      <RowWrapper>
        <ReadingWrapper>Last reading {lastReadingRelativeTime} ago</ReadingWrapper>
        {lastWateredTimeQuery.data ? (
          <ReadingWrapper>
            Last watered {formatDistanceToNow(new Date(lastWateredTimeQuery.data.lastWateredTime))} ago
          </ReadingWrapper>
        ) : null}
      </RowWrapper>
    </div>
  );
};
