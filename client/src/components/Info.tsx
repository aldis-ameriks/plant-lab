import React from 'react';
import { InfoOverlay, Link, TextWrapper } from './Info.styles';

const Info: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <div>
    <InfoOverlay isVisible={isVisible} />
    <TextWrapper isVisible={isVisible}>
      <p>
        Hello{' '}
        <span role="img" aria-label="greetings">
          👋
        </span>
      </p>
      <p>
        This is a dashboard for a plant monitoring system that I built to try to keep my precious rubber tree alive.
      </p>
      <p>
        The code is available{' '}
        <Link href="https://github.com/aldis-ameriks/plant-monitoring" target="_blank" tabIndex={isVisible ? 0 : -1}>
          here
        </Link>
        .
      </p>
    </TextWrapper>
  </div>
);

export default Info;
