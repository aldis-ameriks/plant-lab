import React from 'react';

import Chart from './components/chart/Chart';
import NavigationBar from './components/NavigationBar';
import DataProvider from './DataProvider';
import './App.scss';
import ChartBox from './components/ChartBox';

const App = () => (
  <div>
    <NavigationBar />
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container has-shadow">
          <h1 className="title">Plant monitoring</h1>
          <h2 className="subtitle">A simple plant monitoring system to keep 'em alive.</h2>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <DataProvider
          render={({
            moistures,
            temperatures,
            labels,
            watered,
            lastReadings: { moisture, temperature, time, timeSinceLastReading },
          }) => (
            <>
              <div className="tile is-ancestor has-text-centered">
                <div className="tile">
                  <div className="tile is-parent">
                    <div className="tile is-child notification is-info">
                      <div>Moisture</div>
                      <div>{moisture}%</div>
                    </div>
                  </div>
                  <div className="tile is-parent">
                    <div className="tile is-child notification is-info">
                      <div>Temperature</div>
                      <div>{temperature}</div>
                    </div>
                  </div>
                  <div className="tile is-parent">
                    <div className="tile is-child notification is-info">
                      <div>Last watered</div>
                      <div>{watered} days ago</div>
                    </div>
                  </div>
                  <div className="tile is-parent">
                    <div className="tile is-child notification is-info">
                      <div>Last reading</div>
                      <div>{time}</div>
                      <div>({timeSinceLastReading})</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="columns is-desktop">
                <div className="column is-half-desktop">
                  <ChartBox>
                    <Chart data={moistures} labels={labels} label="Moisture" />
                  </ChartBox>
                </div>
                <div className="column is-half-desktop">
                  <ChartBox>
                    <Chart data={temperatures} labels={labels} label="Temperature" />
                  </ChartBox>
                </div>
              </div>
            </>
          )}
        />
      </div>
    </section>
  </div>
);

export default App;
