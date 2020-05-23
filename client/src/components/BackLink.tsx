import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { LeftArrowIcon } from 'components/icons/LeftArrowIcon';

const BackLinkWrapper = styled(Link)`
  position: absolute;
  cursor: pointer;
  top: 5px;
  left: 10px;
  z-index: 3000;
  background-color: transparent;
  padding: 0.5em;
  font-size: 1.5rem;
  border: 3px solid transparent;
`;

export const BackLink = () => (
  <BackLinkWrapper to="/" data-testid="back-link">
    <LeftArrowIcon color="#8c8c8d" />
  </BackLinkWrapper>
);
