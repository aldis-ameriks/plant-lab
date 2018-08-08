import React from 'react';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import Button from 'reactstrap/lib/Button';

const HomePage = () => (
  <Jumbotron>
    <h2>This is the home page</h2>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      egestas libero sed orci rutrum bibendum. Nulla facilisi. Quisque non
      imperdiet purus. Mauris nec felis augue. Integer aliquam magna a nulla
      bibendum dignissim. Sed efficitur tortor non orci finibus bibendum. Nulla
      iaculis lacinia hendrerit.
    </div>
    <Button className="mt-4" color="primary">
      Lorem Ipsum »
    </Button>
  </Jumbotron>
);

export default HomePage;
