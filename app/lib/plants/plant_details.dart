import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:planty/queries.dart';

class PlantDetails extends StatelessWidget {
  const PlantDetails({@required this.plantId});

  final String plantId;

  @override
  Widget build(BuildContext context) {
    return PlantQuery(
      plantId: plantId,
      builder: (result) {
        dynamic plant = result['plant'];
        return Scaffold(
            appBar: AppBar(title: Text(plant['name'])),
            body: Container(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  children: <Widget>[
                    Row(
                      children: <Widget>[
                        Image(
                          image: AssetImage('assets/plant.jpg'),
                          width: 100,
                          height: 100,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 30),
                          child: Text(plant['name']),
                        )
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 20),
                      child: Text(plant['description']),
                    )
                  ],
                ),
              ),
            ));
      },
    );
  }
}
