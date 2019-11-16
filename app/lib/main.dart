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
            title: 'Flutter Demo',
            theme: ThemeData(
              primarySwatch: Colors.blueGrey,
            ),
            debugShowCheckedModeBanner: false,
            home: App()));
  }
}
