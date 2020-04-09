import 'package:aa.iot/add-device/new_device_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

const known_devices = [
  {'name': 'Hub', 'image': 'assets/hub.png'},
  {'name': 'Moisture Sensor', 'image': 'assets/sensor_v2.1.png'}
];

class NewSensor extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxScrolled) => [
          SliverAppBar(
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: Text('Add new device',
                    style: Theme.of(context).textTheme.title),
              )),
        ],
        body: GridView.count(
          crossAxisCount: 2,
          childAspectRatio: 1.6,
          padding: const EdgeInsets.all(10),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          children: known_devices
              .map((device) => NewDeviceCard(device: device))
              .toList(),
        ),
      ),
    );
  }
}
