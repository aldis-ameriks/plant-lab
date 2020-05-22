import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import '../add-device/new_device.dart';
import 'device_card.dart';
import 'queries/devices_query.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(body: DevicesQuery(
      builder: (result, refetch) {
        dynamic userSensors = result['devices'];
        double width = MediaQuery.of(context).size.width;

        return NestedScrollView(
            headerSliverBuilder: (context, innerBoxScrolled) => [
                  SliverAppBar(
                      pinned: true,
                      flexibleSpace: FlexibleSpaceBar(
                        title: Text('Devices', style: Theme.of(context).textTheme.title),
                      ),
                      actions: <Widget>[
                        IconButton(
                            icon: Icon(Icons.add_circle),
                            onPressed: () async {
                              final result = await Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => NewSensor()),
                              );
                              if (result == 'paired') {
                                Scaffold.of(context)
                                  ..removeCurrentSnackBar()
                                  ..showSnackBar(SnackBar(
                                      backgroundColor: Colors.greenAccent[700],
                                      content: Text('Device paired successfully', textAlign: TextAlign.center)));
                              }
                            }),
                      ]),
                ],
            body: RefreshIndicator(
              onRefresh: () {
                refetch();
                final Completer<Null> completer = new Completer<Null>();
                new Timer(const Duration(seconds: 1), () {
                  completer.complete(null);
                });
                return completer.future;
              },
              child: GridView.count(
                crossAxisCount: (width / 200).round(),
                childAspectRatio: 1.6,
                padding: const EdgeInsets.all(10),
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                children: userSensors.map<Widget>((sensor) => DeviceCard(device: sensor)).toList(),
              ),
            ));
      },
    ));
  }
}
