import React from 'react';
import Navbar from 'reactstrap/lib/Navbar';

import PlantLogo from './logo/PlantLogo';

const NavigationBar = () => (
  <Navbar
    color="light"
    light
    expand="sm"
    className="border-bottom shadow-sm mb-4"
  >
    <a className="navbar-brand" href="/">
      Plant monitoring
      <PlantLogo />
    </a>
  </Navbar>
);

export default NavigationBar;
