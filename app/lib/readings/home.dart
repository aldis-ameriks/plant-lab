import 'package:flutter/material.dart';
import 'package:planty/readings/sensor_card.dart';
import 'package:planty/sensors/queries.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(body: UserSensorsQuery(
      builder: (result) {
        dynamic userSensors = result['sensors'];

        return CustomScrollView(
          slivers: [
            SliverAppBar(
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: Text('Devices', style: Theme.of(context).textTheme.title),
              ),
            ),
            SliverGrid(
              gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
                maxCrossAxisExtent: 200.0,
                crossAxisSpacing: 10.0,
                childAspectRatio: 1.5,
              ),
              delegate: SliverChildBuilderDelegate(
                (BuildContext context, int index) {
                  return Container(margin: EdgeInsets.only(top: 10), child: SensorCard(sensor: userSensors[index]));
                },
                childCount: userSensors.length,
              ),
            )
          ],
        );
      },
    ));
  }
}
