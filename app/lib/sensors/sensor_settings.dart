import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SensorSettings extends StatelessWidget {
  const SensorSettings({@required this.sensorId});

  final String sensorId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sensor settings'),
      ),
      body: Text('Sensor settings placeholder'),
    );
  }
}
