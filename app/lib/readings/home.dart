import 'package:flutter/material.dart';
import 'package:planty/readings/sensor_card.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              SensorCard(nodeId: '4'),
              SensorCard(nodeId: '999'),
            ],
          )
        ],
      ),
    );
  }
}
