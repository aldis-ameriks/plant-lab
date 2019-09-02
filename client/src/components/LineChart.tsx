import React from 'react';
import ReactApexChart from 'react-apexcharts';

type Props = {
  title: string;
  data: any;
  min?: number;
  max?: number;
};

type State = {
  options: any;
  series: any;
};

class LineChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { min, max, title, data } = this.props;
    this.state = {
      options: {
        colors: ['#8a8a8a', '#bbbbbb'],
        chart: {
          fontFamily: 'inherit',
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          colors: ['#8a8a8a', '#bbbbbb'],
          curve: 'smooth', // "smooth" / "straight" / "stepline"
          width: 3,
          // lineCap: 'square', // round, butt , square
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: data.map(({ time }: any) => new Date(time).toLocaleDateString()),
          labels: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          decimalsInFloat: 2,
          min,
          max,
        },
        markers: {
          colors: ['#8a8a8a', '#bbbbbb'],
          strokeColor: '#999999',
        },
        tooltip: {
          enabled: true,
          marker: {
            show: false,
          },
        },
        title: {
          text: title,
          align: 'middle',
          offsetX: 14,
          offsetY: 24,
        },
        legend: {
          show: true,
          offsetY: -10,
          labels: {
            colors: ['#ffffff', '#000000'],
          },
        },
      },
      series: [{ name: title, data: data.map(({ value }: any) => value) }],
    };
  }

  render() {
    const { options, series } = this.state;
    return <ReactApexChart options={options} series={series} type="line" width="100%" />;
  }
}

export default LineChart;
