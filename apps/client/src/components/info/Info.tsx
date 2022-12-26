import React, { useState } from 'react';
import styled from 'styled-components';

import { InfoToggle } from 'components/info/InfoToggle';

const InfoOverlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: black;
  z-index: -1;
  opacity: 0;
  border-radius: 30px;
  transition: all 300ms ease;
  ${(props) =>
    props.isVisible &&
    `
      opacity: 0.7;
      z-index: 1000;
  `}
`;

const TextWrapper = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  font-size: 1.5em;
  text-align: center;
  transition: all 300ms ease;
  z-index: -1;
  padding: 3em;
  opacity: 0;
  ${(props) =>
    props.isVisible &&
    `
      opacity: 1;
      z-index: 2000;
  `}
`;

const Link = styled.a`
  text-decoration: underline;
  color: white;
  cursor: pointer;
`;

export const Info = () => {
  const [isVisible, setVisibility] = useState(false);

  return (
    <>
      <InfoToggle isVisible={isVisible} setVisibility={setVisibility} />
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
            <Link
              href="https://github.com/aldis-ameriks/plant-monitoring"
              target="_blank"
              tabIndex={isVisible ? 0 : -1}
            >
              here
            </Link>
            .
          </p>
        </TextWrapper>
      </div>
    </>
  );
};
