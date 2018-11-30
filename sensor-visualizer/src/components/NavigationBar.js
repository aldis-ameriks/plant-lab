import React from 'react';

import PlantShieldLogo from './logo/PlantLogo';

const NavigationBar = () => (
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <a className="navbar-item" href="/">
        <PlantShieldLogo />
      </a>
      <span className="navbar-item">Save the plants, save the planet</span>
    </div>
  </nav>
);

export default NavigationBar;
