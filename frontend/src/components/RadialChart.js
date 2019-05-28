import React from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

class RadialChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: '#e7e7e7',
              strokeWidth: '97%',
              margin: 5, // margin is in pixels
              shadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#999',
                opacity: 1,
                blur: 2,
              },
            },
            dataLabels: {
              name: {
                show: true,
                color: 'black',
                fontFamily: 'inherit',
                fontSize: '1em',
              },
              value: {
                offsetY: 15,
                fontSize: '1.5em',
                color: 'black',
                fontFamily: 'inherit',
                formatter(val) {
                  switch (props.type) {
                    case 'percentage':
                      return `${val}%`;
                    case 'temperature':
                      return `${val}°c`;
                    default:
                      return val;
                  }
                },
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          colors: 'black',
          gradient: {
            shade: 'light',
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 53, 91],
          },
        },
        labels: [this.props.label],
      },
      series: [this.props.value],
    };
  }

  render() {
    return (
      <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" />
    );
  }
}

RadialChart.propTypes = {
  type: PropTypes.oneOf(['percentage', 'temperature']),
};

RadialChart.defaultProps = {
  type: null,
};

export default RadialChart;
