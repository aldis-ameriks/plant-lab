import React from 'react';
import styled from 'styled-components';

import logo from './PlantShieldLogo2.svg';

const StyledImg = styled.img`
  margin-left: 6px;
  height: 35px;
`;

const PlantShieldLogo = () => <StyledImg src={logo} alt="logo" />;

export default PlantShieldLogo;
