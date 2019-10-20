import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import RadialChart from './RadialChart';
import { useLastReadingQuery, useLastWateredTimeQuery } from '../graphql';

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  max-height: 150px;
  :not(:last-of-type) {
    margin-bottom: 2rem;
  }
`;

const GaugeWrapper = styled.div`
  width: 100%;
  min-width: 150px;
  max-width: 250px;
  margin: 0 -3em; // workaround to bring the apex chart gauges closer horizontally
  @media (min-width: 400px) {
    min-width: 200px;
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

type SensorReadingsProps = {
  nodeId: string;
};

const SensorReadings: React.FC<SensorReadingsProps> = ({ nodeId }) => {
  const lastReadingQuery = useLastReadingQuery({ variables: { nodeId } });
  const lastWateredTimeQuery = useLastWateredTimeQuery({ variables: { nodeId } });

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
          <RadialChart label="temp." value={temperature} type="temperature" maxValue={40} />
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

export default SensorReadings;
