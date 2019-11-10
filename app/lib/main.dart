import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blueGrey,
        ),
        home: Scaffold(
          appBar: AppBar(
            title: Text('Planty'),
          ),
            body: Center(
          child: Text(''),
        )));
  }
}
