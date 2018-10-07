import React from 'react';
import Navbar from 'reactstrap/lib/Navbar';

import PlantShieldLogo from './logo/PlantLogo';

const NavigationBar = () => (
  <Navbar
    color="light"
    light
    expand="sm"
    className="border-bottom shadow-sm mb-4"
  >
    <a className="navbar-brand" href="/">
      Clever Home - Plant Savior
      <PlantShieldLogo />
    </a>
  </Navbar>
);

export default NavigationBar;
