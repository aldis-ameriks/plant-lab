import React from 'react';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import NavigationBar from '../components/NavigationBar';
import Chart from '../components/chart/Chart';

const HomePage = () => (
  <div>
    <NavigationBar />
    <Jumbotron>
      <Chart />
    </Jumbotron>
  </div>
);

export default HomePage;
