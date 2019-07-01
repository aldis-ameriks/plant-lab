import PropTypes from 'prop-types';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

class RadialChart extends React.Component {
  constructor(props) {
    super(props);

    const { label } = this.props;

    this.state = {
      options: {
        states: {
          hover: {
            filter: {
              type: 'darken',
              value: 1,
            },
          },
        },
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
                formatter: val => {
                  const valueForLabel = this.getValueForLabel(val);
                  // TODO: Chart component should not know about domain specific formatting types. Extract via `unit` prop.
                  switch (props.type) {
                    case 'percentage':
                      return `${valueForLabel}%`;
                    case 'temperature':
                      return `${valueForLabel}°c`;
                    case 'voltage':
                      return `${valueForLabel} V`;
                    default:
                      return valueForLabel;
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
        labels: [label],
      },
      series: [this.getValueForRadialBar()],
    };
  }

  getValueForRadialBar() {
    const { value, maxValue, decimals } = this.props;
    // TODO: workaround due to apex radial chart not supporting value range.
    //       https://github.com/apexcharts/apexcharts.js/issues/449
    return (value * (100 / maxValue)).toFixed(decimals);
  }

  getValueForLabel(val) {
    const { maxValue, decimals } = this.props;
    // TODO: workaround due to apex radial chart not supporting value range.
    //       https://github.com/apexcharts/apexcharts.js/issues/449
    return (val / (100 / maxValue)).toFixed(decimals);
  }

  render() {
    const { options, series } = this.state;
    return <ReactApexChart options={options} series={series} type="radialBar" />;
  }
}

RadialChart.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['percentage', 'temperature', 'voltage']),
  maxValue: PropTypes.number,
  decimals: PropTypes.number,
};

RadialChart.defaultProps = {
  type: null,
  maxValue: 100,
  decimals: 0,
};

export default RadialChart;
