import React from 'react';
import PropTypes from 'prop-types';
import { InfoOverlay, Link, TextWrapper } from './styles';

const Info = ({ isVisible }) => (
  <div>
    <InfoOverlay isVisible={isVisible} />
    <TextWrapper isVisible={isVisible}>
      <p>
        Hello{' '}
        <span role="img" aria-label="greetings">
          👋
        </span>
      </p>
      <p>This is a dashboard for a plant monitoring system that I built.</p>
      <p>
        The code is available{' '}
        <Link
          href="https://github.com/aldis-ameriks/plant-monitoring"
          target="_blank"
          tabIndex={isVisible ? '0' : '-1'}
        >
          here
        </Link>
        .
      </p>
    </TextWrapper>
  </div>
);

Info.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default Info;
