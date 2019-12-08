import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:planty/readings/queries.dart';
import 'package:planty/sensors/sensor_settings.dart';
import 'package:time_formatter/time_formatter.dart';

class SensorDetails extends StatelessWidget {
  const SensorDetails({@required this.sensorId});

  final String sensorId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromRGBO(237, 237, 237, 1),
      appBar: AppBar(
        title: Text('Device $sensorId', style: Theme.of(context).textTheme.title),
        actions: <Widget>[
          IconButton(
              icon: Icon(Icons.settings),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SensorSettings(sensorId: sensorId)),
                );
              }),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(10),
        child: Center(
          child: ListView(
            children: <Widget>[
              LastReadingQuery(
                sensorId: sensorId,
                builder: (result) {
                  dynamic lastReading = result['lastReading'];

                  return Column(
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          Image(
                            image: AssetImage('assets/sensor_v1.0.png'),
                            width: 100,
                            height: 150,
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: lastReading != null
                                ? <Widget>[
                                    Text('Sensor ID: $sensorId'),
                                    Text('Moisture: ${lastReading['moisture'].round()} %'),
                                    Text('Temperature: ${lastReading['temperature']} °C'),
                                    Text('Battery: ${lastReading['battery_voltage']} V'),
                                    Text(
                                        'Last Reading: ${formatTime(DateTime.parse(lastReading['time']).millisecondsSinceEpoch)}'),
                                    LastWateredQuery(
                                      sensorId: sensorId,
                                      builder: (result) {
                                        dynamic lastWateredTime = result['lastWateredTime'];
                                        if (lastWateredTime == null) {
                                          return Text('');
                                        }

                                        String formatted =
                                            formatTime(DateTime.parse(lastWateredTime).millisecondsSinceEpoch);
                                        return Text('Last Watered: $formatted');
                                      },
                                    )
                                  ]
                                : [
                                    Text('Sensor ID: $sensorId'),
                                  ],
                          )
                        ],
                      )
                    ],
                  );
                },
              ),
              ReadingsQuery(
                sensorId: sensorId,
                builder: (result) {
                  dynamic readings = result['readings'];

                  return Column(
                    children: <Widget>[
                      Padding(
                        padding: const EdgeInsets.only(top: 16, bottom: 16),
                        child: SizedBox(
                          height: 220,
                          child: new charts.TimeSeriesChart(
                            _createData(readings, 'moisture'),
                            primaryMeasureAxis: new charts.NumericAxisSpec(
                                tickProviderSpec: new charts.BasicNumericTickProviderSpec(desiredMinTickCount: 4)),
                            behaviors: [
                              new charts.ChartTitle('Moisture',
                                  innerPadding: 16, titleStyleSpec: charts.TextStyleSpec(fontSize: 14)),
                              new charts.LinePointHighlighter(
                                  drawFollowLinesAcrossChart: true,
                                  showHorizontalFollowLine: charts.LinePointHighlighterFollowLineType.nearest,
                                  showVerticalFollowLine: charts.LinePointHighlighterFollowLineType.nearest),
                            ],
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 16, bottom: 16),
                        child: SizedBox(
                          height: 220,
                          child: new charts.TimeSeriesChart(
                              _createData(
                                readings,
                                'temperature',
                              ),
                              behaviors: [
                                new charts.ChartTitle('Temperature',
                                    innerPadding: 16, titleStyleSpec: charts.TextStyleSpec(fontSize: 14)),
                                new charts.LinePointHighlighter(
                                    drawFollowLinesAcrossChart: true,
                                    showHorizontalFollowLine: charts.LinePointHighlighterFollowLineType.nearest,
                                    showVerticalFollowLine: charts.LinePointHighlighterFollowLineType.nearest)
                              ],
                              primaryMeasureAxis: new charts.NumericAxisSpec(
                                  tickProviderSpec: new charts.BasicNumericTickProviderSpec(zeroBound: false))),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 16, bottom: 16),
                        child: SizedBox(
                          height: 220,
                          child: new charts.TimeSeriesChart(_createData(readings, 'battery_voltage'),
                              behaviors: [
                                new charts.ChartTitle('Battery Voltage',
                                    innerPadding: 16, titleStyleSpec: charts.TextStyleSpec(fontSize: 14)),
                                new charts.LinePointHighlighter(
                                    drawFollowLinesAcrossChart: true,
                                    showHorizontalFollowLine: charts.LinePointHighlighterFollowLineType.nearest,
                                    showVerticalFollowLine: charts.LinePointHighlighterFollowLineType.nearest)
                              ],
                              primaryMeasureAxis: new charts.NumericAxisSpec(
                                  tickProviderSpec: new charts.BasicNumericTickProviderSpec(zeroBound: false))),
                        ),
                      ),
                    ],
                  );
                },
              )
            ],
          ),
        ),
      ),
    );
  }

  static List<charts.Series<TimeSeriesReading, DateTime>> _createData(List<dynamic> data, String key) {
    final List<TimeSeriesReading> parsedData =
        data.map((entry) => new TimeSeriesReading(DateTime.parse(entry['time']), entry[key])).toList();

    return [
      new charts.Series<TimeSeriesReading, DateTime>(
        id: 'Readings',
        colorFn: (_, __) => charts.MaterialPalette.gray.shadeDefault,
        domainFn: (TimeSeriesReading reading, _) => reading.time,
        measureFn: (TimeSeriesReading reading, _) => reading.value,
        data: parsedData,
      ),
    ];
  }
}

class TimeSeriesReading {
  final DateTime time;
  final num value;

  TimeSeriesReading(this.time, this.value);
}
