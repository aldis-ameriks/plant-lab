import 'dart:async';

import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:planty/readings/queries.dart';
import 'package:planty/sensors/sensor_settings.dart';
import 'package:time_formatter/time_formatter.dart';

class DeviceDetails extends StatelessWidget {
  const DeviceDetails({@required this.deviceId});

  final String deviceId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: NestedScrollView(
            headerSliverBuilder: (context, innerBoxScrolled) => [
                  SliverAppBar(
                      pinned: true,
                      flexibleSpace: FlexibleSpaceBar(
                        title: Text('Device $deviceId', style: Theme.of(context).textTheme.title),
                      ),
                      actions: <Widget>[
                        IconButton(
                            icon: Icon(Icons.settings),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => SensorSettings(deviceId: deviceId)),
                              );
                            }),
                      ]),
                ],
            body: ReadingsQuery(
              deviceId: deviceId,
              builder: (result, refetch) {
                dynamic lastReading = result['lastReading'];
                dynamic readings = result['readings'];
                dynamic lastWateredTime = result['lastWateredTime'];
                String formattedLastWatered = lastWateredTime == null
                    ? 'Never'
                    : formatTime(DateTime.parse(lastWateredTime ?? '').millisecondsSinceEpoch);
                String formattedLastReading = lastReading == null
                    ? 'Never'
                    : formatTime(DateTime.parse(lastReading['time']).millisecondsSinceEpoch);
                String name = result['device']['name'] ?? '';
                String room = result['device']['room'] ?? '';
                return (RefreshIndicator(
                  onRefresh: () {
                    refetch();
                    final Completer<Null> completer = new Completer<Null>();
                    new Timer(const Duration(seconds: 1), () {
                      completer.complete(null);
                    });
                    return completer.future;
                  },
                  child: ListView(
                    padding: EdgeInsets.all(10),
                    children: <Widget>[
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Padding(
                            padding: const EdgeInsets.only(right: 30),
                            child: Image(
                              image: AssetImage('assets/sensor_v1.0.png'),
                              width: 100,
                              height: 150,
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
                      )
                    ],
                  ),
                ));
              },
            )));
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
