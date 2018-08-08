import React from 'react';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import NavigationBar from './components/NavigationBar';
import Chart from './components/chart/Chart';

const App = () => (
  <div>
    <NavigationBar />
    <Jumbotron>
      <Chart />
    </Jumbotron>
  </div>
);

export default App;
