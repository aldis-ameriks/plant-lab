import 'package:flutter/material.dart';
import 'package:planty/readings/last_reading_query.dart';

class SensorsList extends StatefulWidget {
  @override
  _SensorsListState createState() => _SensorsListState();
}

class _SensorsListState extends State<SensorsList> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              LastReading(nodeId: '4'),
              LastReading(nodeId: '999'),
            ],
          )
        ],
      ),
    );
  }
}
