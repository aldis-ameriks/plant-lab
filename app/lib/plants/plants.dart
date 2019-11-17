import 'package:flutter/material.dart';
import 'package:planty/plants/plant_details.dart';
import 'package:planty/queries.dart';

class Plants extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text('Plants')),
        body: PlantsQuery(builder: (result) {
          dynamic plants = result['plants'];
          return ListView.separated(
              padding: const EdgeInsets.all(10),
              itemCount: plants.length,
              separatorBuilder: (BuildContext context, int index) => const Divider(),
              itemBuilder: (BuildContext context, int index) {
                return GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => PlantDetails(plantId: plants[index]['id'])),
                  ),
                  child: Flex(
                    direction: Axis.horizontal,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          Image(
                            image: AssetImage('assets/plant.jpg'),
                            width: 70,
                            height: 70,
                          ),
                          Padding(
                            padding: const EdgeInsets.only(left: 20),
                            child: Text(plants[index]['name']),
                          )
                        ],
                      ),
                      Icon(
                        Icons.chevron_right,
                        color: Colors.grey[600],
                      ),
                    ],
                  ),
                );
              });
        }));
  }
}
