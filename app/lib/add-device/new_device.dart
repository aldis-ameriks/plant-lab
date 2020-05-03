import 'dart:math';

import 'package:plantlab/add-device/new_device_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class NewSensor extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List knownDevices = [
      {
        'name': 'Hub v1',
        'image': 'assets/hub_10.png',
        'version': 'hub_10',
        'pairingImage': Container(
            child: Image(
              image: AssetImage('assets/hub_10.png'),
              height: 100,
              width: 200,
            ),
            margin: EdgeInsets.only(bottom: 50, top: 30)),
        'pairingText': r'''
Make sure the Hub is powered up and can access public network.

Hub also needs to be connected on the same network as you.
        '''
      },
      {
        'name': 'Moisture Sensor v1',
        'image': 'assets/sensor_10.png',
        'version': 'sensor_10',
        'pairingImage': Transform.rotate(
          angle: -pi / 2,
          child: Image(
            image: AssetImage('assets/sensor_10.png'),
            height: 160,
            width: 50,
          ),
        ),
        'pairingText': r'''
This sensor can only be connected through a Hub which is connected to the same network as you.

Make sure the Hub is powered and connected to the network, then power up the sensor.
            ''',
      }
    ];

    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxScrolled) => [
          SliverAppBar(
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: Text('Add new device', style: Theme.of(context).textTheme.title),
              )),
        ],
        body: GridView.count(
          crossAxisCount: 2,
          childAspectRatio: 1.6,
          padding: const EdgeInsets.all(10),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          children: knownDevices.map((device) => NewDeviceCard(device: device)).toList(),
        ),
      ),
    );
  }
}
