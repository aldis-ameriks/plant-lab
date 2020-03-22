import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { LeftArrow } from './icons/LeftArrow';

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

const BackLink = () => (
  <BackLinkWrapper to="/">
    <LeftArrow color="#8c8c8d" />
  </BackLinkWrapper>
);

export default BackLink;
