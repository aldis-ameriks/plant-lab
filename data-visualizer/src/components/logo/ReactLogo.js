import React from 'react';
import styled from 'styled-components';

import { rotate360 } from './keyframes';
import logo from './ReactLogo.svg';

const StyledImg = styled.img`
  animation: ${rotate360} 2s linear infinite;
  height: 35px;
`;

const ReactLogo = () => <StyledImg src={logo} alt="logo" />;

export default ReactLogo;
