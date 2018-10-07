import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import PlantShieldLogo from './logo/PlantLogo';

const NavigationBar = () => (
  <AppBar position="static" color="default">
    <Toolbar>
      <Typography variant="title" color="inherit">
        Save the plants, save the planet
      </Typography>
      <PlantShieldLogo />
    </Toolbar>
  </AppBar>
);

export default NavigationBar;
