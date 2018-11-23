import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Chart from 'components/chart/Chart';
import NavigationBar from 'components/NavigationBar';
import DataProvider from 'DataProvider';

const styles = theme => ({
  layout: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.unit * 2,
    maxWidth: 1000
  },
  paper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    margin: `${theme.spacing.unit * 2}px`
  },
  inlinePaper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    margin: `${theme.spacing.unit * 2}px`,
    display: 'inline-block',
    verticalAlign: 'middle'
  }
});

const stylesProps = PropTypes.shape({
  layout: PropTypes.string.isRequired,
  paper: PropTypes.string.isRequired,
  inlinePaper: PropTypes.string.isRequired
});

const App = ({ classes }) => (
  <div>
    <CssBaseline />
    <NavigationBar />
    <main className={classes.layout}>
      <DataProvider
        render={({ data, labels, lastReadings: { moisture, temperature, time, timeSinceLastReading } }) => (
          <>
            <DataBox classes={classes}>
              <div>Moisture</div>
              <div>{moisture}%</div>
            </DataBox>

            <DataBox classes={classes}>
              <div>Temperature</div>
              <div>{temperature}</div>
            </DataBox>

            <DataBox classes={classes}>
              <div>Last reading</div>
              <div>{time}</div>
              <div>({timeSinceLastReading})</div>
            </DataBox>

            <ChartBox classes={classes} data={data} labels={labels} />
          </>
        )}
      />
    </main>
  </div>
);

App.propTypes = {
  classes: stylesProps.isRequired
};

const ChartBox = ({ classes, data, labels }) => (
  <Paper className={classes.paper}>
    <Chart data={data} labels={labels} />
  </Paper>
);

ChartBox.propTypes = {
  classes: stylesProps.isRequired,
  data: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

const DataBox = ({ classes, children }) => (
  <Paper className={classes.inlinePaper}>
    <Typography variant="title" align="center">
      {children}
    </Typography>
  </Paper>
);

DataBox.propTypes = {
  classes: stylesProps.isRequired,
  children: PropTypes.node.isRequired
};

export default withStyles(styles)(App);
