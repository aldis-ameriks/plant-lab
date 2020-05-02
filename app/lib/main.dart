import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'app.dart';
import 'client_provider.dart';
import 'config.dart';
import 'user_state_provider.dart';

Future<void> main() async {
  await DotEnv().load('envs/.env');
  await DotEnv().load('envs/.env.local');
  updateConfig();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
    ]);

    return UserStateProvider(
      child: ClientProvider(
          uri: config['graphql']['endpoint'],
          subscriptionUri: config['graphql']['subscriptions'],
          child: MaterialApp(
              title: 'Plant Monitoring',
              theme: ThemeData(
                brightness: Brightness.light,
                primaryColor: Colors.grey[50],
                primarySwatch: Colors.grey,
                accentColor: Colors.black,
                fontFamily: 'Avenir',
                textTheme: TextTheme(
                  headline: TextStyle(fontSize: 72.0, fontWeight: FontWeight.bold),
                  title: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
                  body1: TextStyle(fontSize: 14.0),
                  body2: TextStyle(fontSize: 12.0),
                ),
              ),
              debugShowCheckedModeBanner: false,
              home: App())),
    );
  }
}
