import React from 'react';
import styled from 'styled-components';

import logo from './ReactLogo.svg';

const StyledImg = styled.img`
  animation: App-logo-spin infinite 20s linear;
  height: 35px;

  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ReactLogo = () => <StyledImg src={logo} alt="logo" />;

export default ReactLogo;
