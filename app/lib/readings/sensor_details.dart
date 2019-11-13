import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:planty/queries.dart';
import 'package:time_formatter/time_formatter.dart';

class SensorDetails extends StatelessWidget {
  const SensorDetails({@required this.nodeId});

  final String nodeId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromRGBO(237, 237, 237, 1),
      appBar: AppBar(title: Text('Sensor $nodeId')),
      body: Padding(
        padding: EdgeInsets.all(10),
        child: Center(
          child: ListView(
            children: <Widget>[
              LastReadingQuery(
                nodeId: nodeId,
                builder: (result) {
                  dynamic lastReading = result['lastReading'];
                  String formattedLastReading = formatTime(DateTime.parse(lastReading['time']).millisecondsSinceEpoch);

                  return Column(
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          Image(
                            image: AssetImage('assets/plant.jpg'),
                            width: 140,
                            height: 140,
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text('Sensor ID: $nodeId'),
                              Text('Moisture: ${lastReading['moisture'].round()} %'),
                              Text('Temperature: ${lastReading['temperature']} °C'),
                              Text('Battery: ${lastReading['battery_voltage']} V'),
                              Text('Last Reading: $formattedLastReading'),
                              LastWateredQuery(
                                nodeId: nodeId,
                                builder: (result) {
                                  dynamic lastWateredTime = result['lastWateredTime'];
                                  String formatted = formatTime(DateTime.parse(lastWateredTime).millisecondsSinceEpoch);
                                  return Text('Last Watered: $formatted');
                                },
                              )
                            ],
                          )
                        ],
                      )
                    ],
                  );
                },
              ),
              ReadingsQuery(
                nodeId: nodeId,
                builder: (result) {
                  dynamic readings = result;

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
