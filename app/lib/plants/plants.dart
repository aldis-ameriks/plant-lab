import 'package:flutter/material.dart';
import 'package:planty/queries.dart';

class Plants extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return PlantsQuery(builder: (result) {
      print(result['plants'][0]['description']);
      return Text(result['plants'][0]['name']);
    });
  }
}
