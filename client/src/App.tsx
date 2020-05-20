import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { SensorDetails } from './pages/SensorDetails';
import { SensorList } from './pages/SensorList';

export const App = () => (
  <Router>
    <Switch>
      <Route path="/sensors/:id">
        <SensorDetails />
      </Route>
      <Route>
        <SensorList />
      </Route>
    </Switch>
  </Router>
);
