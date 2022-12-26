import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:time_formatter/time_formatter.dart';

class SensorDetails extends StatelessWidget {
  SensorDetails({@required this.result});

  final dynamic result;

  @override
  Widget build(BuildContext context) {
    dynamic lastReading = result['lastReading'];
    dynamic readings = result['readings'];
    dynamic lastWateredTime = result['lastWateredTime'];
    String formattedLastWatered =
        lastWateredTime == null ? 'Never' : formatTime(DateTime.parse(lastWateredTime ?? '').millisecondsSinceEpoch);
    String formattedLastReading =
        lastReading == null ? 'Never' : formatTime(DateTime.parse(lastReading['time']).millisecondsSinceEpoch);
    String name = result['device']['name'] ?? '';
    String room = result['device']['room'] ?? '';

    return ListView(
      padding: EdgeInsets.all(10),
      children: <Widget>[
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(right: 30),
              child: Image(
                image: AssetImage('assets/${result['device']['version']}.png'),
                width: 100,
                height: 180,
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: lastReading != null
                  ? <Widget>[
                      Text(name),
                      Text(room),
                      Text('Moisture: ${lastReading['moisture'].round()} %'),
                      Text('Temperature: ${lastReading['temperature']} °C'),
                      Text('Battery: ${lastReading['battery_voltage']} V'),
                      Text('Last Reading: $formattedLastReading'),
                      Text('Last Watered: $formattedLastWatered')
                    ]
                  : [Text(name), Text(room), Text('No readings found')],
            )
          ],
        ),
        Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(top: 16, bottom: 16),
              child: SizedBox(
                height: 220,
                child: new charts.TimeSeriesChart(
                  _createData(readings, 'moisture'),
                  primaryMeasureAxis: new charts.NumericAxisSpec(
                      tickProviderSpec:
                          new charts.BasicNumericTickProviderSpec(desiredMinTickCount: 6, zeroBound: true)),
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
                        tickProviderSpec:
                            new charts.BasicNumericTickProviderSpec(zeroBound: false, desiredMinTickCount: 6))),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 16, bottom: 16),
              child: SizedBox(
                height: 220,
                child: new charts.TimeSeriesChart(_createData(readings, 'light'),
                    behaviors: [
                      new charts.ChartTitle('Light',
                          innerPadding: 16, titleStyleSpec: charts.TextStyleSpec(fontSize: 14)),
                      new charts.LinePointHighlighter(
                          drawFollowLinesAcrossChart: true,
                          showHorizontalFollowLine: charts.LinePointHighlighterFollowLineType.nearest,
                          showVerticalFollowLine: charts.LinePointHighlighterFollowLineType.nearest)
                    ],
                    primaryMeasureAxis: new charts.NumericAxisSpec(
                        tickProviderSpec:
                            new charts.BasicNumericTickProviderSpec(zeroBound: true, desiredMinTickCount: 4))),
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
                        tickProviderSpec:
                            new charts.BasicNumericTickProviderSpec(zeroBound: true, desiredMinTickCount: 4))),
              ),
            ),
          ],
        )
      ],
    );
  }

  static List<charts.Series<TimeSeriesReading, DateTime>> _createData(List<dynamic> data, String key) {
    final List<TimeSeriesReading> parsedData =
        data.map((entry) => new TimeSeriesReading(DateTime.parse(entry['time']), entry[key])).toList();

    return [
      new charts.Series<TimeSeriesReading, DateTime>(
        id: 'Readings',
        colorFn: (_, __) => charts.MaterialPalette.gray.shade800,
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
