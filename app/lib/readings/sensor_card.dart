import 'package:flutter/material.dart';
import 'package:planty/queries.dart';
import 'package:planty/readings/sensor_details.dart';

class SensorCard extends StatelessWidget {
  const SensorCard({@required this.nodeId});

  final String nodeId;

  @override
  Widget build(BuildContext context) => LastReadingQuery(
      nodeId: nodeId,
      builder: (result) {
        dynamic lastReading = result['lastReading'];

        return (Column(
          children: <Widget>[
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              color: Color.fromRGBO(237, 237, 237, 1),
              margin: EdgeInsets.all(10),
              child: GestureDetector(
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SensorDetails(nodeId: nodeId)),
                ),
                child: Container(
                    width: (MediaQuery.of(context).size.width / 2) - 20,
                    padding: EdgeInsets.only(bottom: 20, top: 20, left: 10, right: 10),
                    child: Row(
                      children: <Widget>[
                        Image(
                          image: AssetImage('assets/plant.jpg'),
                          width: 70,
                          height: 70,
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text('ID: ${lastReading['node_id']}'),
                            Text('M: ${lastReading['moisture'].round()} %'),
                            Text('T: ${lastReading['temperature']} °C'),
                            Text('B: ${lastReading['battery_voltage']} V'),
                          ],
                        )
                      ],
                    )),
              ),
            ),
          ],
        ));
      });
}
