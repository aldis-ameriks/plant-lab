import 'package:flutter/material.dart';
import 'package:planty/app.dart';
import 'package:planty/client_provider.dart';
import 'package:planty/config.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ClientProvider(
        uri: GRAPHQL_ENDPOINT,
        subscriptionUri: SUBSCRIPTION_ENDPOINT,
        child: MaterialApp(
            title: 'Plant Monitoring',
            theme: ThemeData(
              brightness: Brightness.light,
              primaryColor: Colors.grey[50],
              primarySwatch: Colors.blue,
              accentColor: Colors.teal[500],
              fontFamily: 'Avenir',
              textTheme: TextTheme(
                headline: TextStyle(fontSize: 72.0, fontWeight: FontWeight.bold),
                title: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
                body1: TextStyle(fontSize: 14.0),
              ),
            ),
            debugShowCheckedModeBanner: false,
            home: App()));
  }
}
