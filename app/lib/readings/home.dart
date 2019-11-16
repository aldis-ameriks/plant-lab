import 'package:flutter/material.dart';
import 'package:planty/queries.dart';
import 'package:planty/readings/sensor_card.dart';
import 'package:planty/sensors/new_sensor.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Sensors'),
          actions: <Widget>[
            IconButton(
                icon: Icon(Icons.add_circle),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => NewSensor()),
                  );
                }),
          ],
        ),
        body: UserSensorsQuery(
          builder: (result) {
            dynamic userSensors = result['sensors'];
            return Wrap(children: userSensors.map<Widget>((sensor) => SensorCard(sensor: sensor)).toList());
          },
        ));
  }
}
