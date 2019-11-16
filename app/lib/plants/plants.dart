import 'package:flutter/material.dart';
import 'package:planty/queries.dart';

class Plants extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return PlantsQuery(builder: (result) {
      dynamic plants = result['plants'];
      return ListView.separated(
          padding: const EdgeInsets.all(8),
          itemCount: plants.length,
          separatorBuilder: (BuildContext context, int index) => const Divider(),
          itemBuilder: (BuildContext context, int index) {
            return Container(
                height: 50,
                child: Row(
                  children: <Widget>[
                    Image(
                      image: AssetImage('assets/plant.jpg'),
                      width: 70,
                      height: 70,
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 10),
                      child: Text(plants[index]['name']),
                    )
                  ],
                ));
          });
    });
  }
}
