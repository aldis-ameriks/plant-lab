import React from 'react';
import styled from 'styled-components';

import logo from './PlantLogo.svg';

const StyledImg = styled.img`
  margin-left: 6px;
  height: 35px;
`;

const PlantLogo = () => <StyledImg src={logo} alt="logo" />;

export default PlantLogo;
