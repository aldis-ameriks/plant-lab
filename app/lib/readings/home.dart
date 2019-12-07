import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:planty/readings/sensor_card.dart';
import 'package:planty/sensors/queries.dart';

class Home extends StatelessWidget {
  final GlobalKey<RefreshIndicatorState> _refreshIndicatorKey = new GlobalKey<RefreshIndicatorState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: UserSensorsQuery(
      builder: (result, refetch) {
        dynamic userSensors = result['sensors'];

        return NestedScrollView(
            headerSliverBuilder: (context, innerBoxScrolled) => [
                  SliverAppBar(
                      pinned: true,
                      flexibleSpace: FlexibleSpaceBar(
                        title: Text('Devices', style: Theme.of(context).textTheme.title),
                      ),
                      actions: <Widget>[
                        new IconButton(
                            icon: const Icon(Icons.refresh),
                            tooltip: 'Refresh',
                            onPressed: () {
                              _refreshIndicatorKey.currentState.show();
                            }),
                      ]),
                ],
            body: Container(
              child: RefreshIndicator(
                onRefresh: () {
                  final Completer<Null> completer = new Completer<Null>();
                  new Timer(const Duration(seconds: 1), () {
                    completer.complete(null);
                  });
                  return completer.future;
                },
                child: GridView.count(
                  crossAxisCount: 2,
                  childAspectRatio: 1.6,
                  padding: const EdgeInsets.all(10),
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  children: userSensors.map<Widget>((sensor) => SensorCard(sensor: sensor)).toList(),
                ),
              ),
            ));
      },
    ));
  }
}
