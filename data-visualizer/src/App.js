import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavigationBar from './components/NavigationBar';
import Chart from './components/chart/Chart';

const App = () => (
  <div>
    <CssBaseline />
    <NavigationBar />
    <div>
      <Chart />
    </div>
  </div>
);

export default App;
