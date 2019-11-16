import 'package:flutter/material.dart';
import 'package:planty/queries.dart';
import 'package:planty/readings/sensor_card.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Sensors')),
      body: UserSensorsQuery(
        builder: (result) {
          dynamic userSensors = result['sensors'];
          return Wrap(children: userSensors.map<Widget>((sensor) => SensorCard(sensor: sensor)).toList());
        },
      )
    );
  }
}
