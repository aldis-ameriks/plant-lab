import 'package:flutter/material.dart';
import 'package:planty/readings/sensor_details.dart';

class SensorCard extends StatelessWidget {
  const SensorCard({@required this.sensor});

  final dynamic sensor;

  @override
  Widget build(BuildContext context) {
    String sensorId = sensor['id'];
    String name = sensor['name'];
    String room = sensor['room'];

    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => SensorDetails(sensorId: sensorId)),
      ),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        child: Container(
            padding: EdgeInsets.all(10),
            child: Row(
              children: <Widget>[
                Container(
                  margin: EdgeInsets.only(right: 20),
                  child: Image(
                    image: AssetImage('assets/plant.jpg'),
                    width: 50,
                    height: 50,
                  ),
                ),
                Flexible(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(name ?? '', style: Theme.of(context).textTheme.body2),
                        Text('ID: $sensorId', style: Theme.of(context).textTheme.body2),
                        Text(room ?? '', style: Theme.of(context).textTheme.body2),
                      ]),
                )
              ],
            )),
      ),
    );
  }
}
