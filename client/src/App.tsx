import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SensorDetails from './pages/SensorDetails';
import SensorList from './pages/SensorList';

const App = () => (
  <Router>
    <Switch>
      <Route path="/sensors/:id">
        <SensorDetails />
      </Route>
      <Route path="/">
        <SensorList />
      </Route>
    </Switch>
  </Router>
);

export default App;
