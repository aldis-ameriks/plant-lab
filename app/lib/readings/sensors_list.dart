import 'package:flutter/material.dart';
import 'package:planty/readings/last_reading_query.dart';

class SensorsList extends StatefulWidget {
  static const BottomNavigationBarItem navItem = BottomNavigationBarItem(
    icon: Icon(Icons.movie_filter),
    title: Text('Episodes'),
  );

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
