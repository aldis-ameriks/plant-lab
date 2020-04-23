import 'dart:async';

import 'package:aa.iot/device/sensor_details.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../device-settings/device_settings.dart';
import 'hub_details.dart';
import 'queries/reading_query.dart';

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
                                MaterialPageRoute(builder: (context) => DeviceSettings(deviceId: deviceId)),
                              );
                            }),
                      ]),
                ],
            body: ReadingsQuery(
              deviceId: deviceId,
              builder: (result, refetch) {
                String type = result['device']['type'];
                Widget child;
                if (type == 'sensor') {
                  child = SensorDetails(result: result);
                } else if (type == 'hub') {
                  child = HubDetails(result: result);
                }

                return (RefreshIndicator(
                  onRefresh: () {
                    refetch();
                    final Completer<Null> completer = new Completer<Null>();
                    new Timer(const Duration(seconds: 1), () {
                      completer.complete(null);
                    });
                    return completer.future;
                  },
                  child: child,
                ));
              },
            )));
  }
}
