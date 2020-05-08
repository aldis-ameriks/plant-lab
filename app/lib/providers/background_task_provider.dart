import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:workmanager/workmanager.dart';

import '../config.dart';

class BackgroundTaskProvider extends StatefulWidget {
  BackgroundTaskProvider({@required this.builder});

  final dynamic builder;

  @override
  State<StatefulWidget> createState() {
    return _BackgroundTaskState();
  }
}

class _BackgroundTaskState extends State<BackgroundTaskProvider> {
  @override
  Widget build(BuildContext context) {
    return widget.builder();
  }

  @override
  void initState() {
    super.initState();
    Workmanager.initialize(
      callbackDispatcher,
      isInDebugMode: true,
    );
  }

  static void callbackDispatcher() {
    Workmanager.executeTask((task, inputData) async {
      switch (task) {
        case Workmanager.iOSBackgroundTask:
          print("The iOS background fetch was triggered");
          http.get('${config['backend']['endpoint']}/ping?test=true');
          break;
      }
      http.get('${config['backend']['endpoint']}/ping?test2=true');

      return Future.value(true);
    });
  }
}
