import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'package:rxdart/subjects.dart';
import 'package:workmanager/workmanager.dart';

import '../config.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
final BehaviorSubject<ReceivedNotification> didReceiveLocalNotificationSubject =
    BehaviorSubject<ReceivedNotification>();
final BehaviorSubject<String> selectNotificationSubject = BehaviorSubject<String>();

NotificationAppLaunchDetails notificationAppLaunchDetails;

class ReceivedNotification {
  final int id;
  final String title;
  final String body;
  final String payload;

  ReceivedNotification({
    @required this.id,
    @required this.title,
    @required this.body,
    @required this.payload,
  });
}

_configureNotifications() async {
  notificationAppLaunchDetails = await flutterLocalNotificationsPlugin.getNotificationAppLaunchDetails();

  var initializationSettingsAndroid = AndroidInitializationSettings('app_icon');
  var initializationSettingsIOS = IOSInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
      onDidReceiveLocalNotification: (int id, String title, String body, String payload) async {
        didReceiveLocalNotificationSubject
            .add(ReceivedNotification(id: id, title: title, body: body, payload: payload));
      });
  var initializationSettings = InitializationSettings(initializationSettingsAndroid, initializationSettingsIOS);
  await flutterLocalNotificationsPlugin.initialize(initializationSettings,
      onSelectNotification: (String payload) async {
    if (payload != null) {
      debugPrint('notification payload: ' + payload);
    }
    selectNotificationSubject.add(payload);
  });
}

void _configureDidReceiveLocalNotificationSubject() {
  didReceiveLocalNotificationSubject.stream.listen((ReceivedNotification receivedNotification) async {});
}

void _configureSelectNotificationSubject() {
  selectNotificationSubject.stream.listen((String payload) async {});
}

Future<void> showNotification(String deviceId, String title, String body) async {
  // TODO: Update fields for Android devices
  var androidPlatformChannelSpecifics = AndroidNotificationDetails(
      'your channel id', 'your channel name', 'your channel description',
      importance: Importance.Max, priority: Priority.High, ticker: 'ticker');
  var iOSPlatformChannelSpecifics = IOSNotificationDetails();
  var platformChannelSpecifics = NotificationDetails(androidPlatformChannelSpecifics, iOSPlatformChannelSpecifics);
  await flutterLocalNotificationsPlugin.show(0, title, body, platformChannelSpecifics, payload: deviceId);
}

void callbackDispatcher() {
  Workmanager.executeTask((task, inputData) async {
    print('Task triggered: $task');
    switch (task) {
      case Workmanager.iOSBackgroundTask:
        _configureNotifications();
        _configureDidReceiveLocalNotificationSubject();
        _configureSelectNotificationSubject();
        showNotification('7', 'Notification title', 'Notification body');
        print("The iOS background fetch was triggered");
        await ping('/ping?test=true');
        break;
    }
    await ping('/ping?test2=true');
    return Future.value(true);
  });
}

Future<void> ping(String path) async {
  String url = '${config['backend']['endpoint']}$path';
  print('Fetching $url');
  http.Response res = await http.get(url);
  print(res.body);
}

class BackgroundTaskProvider extends StatefulWidget {
  BackgroundTaskProvider({@required this.child});

  final Widget child;

  @override
  State<StatefulWidget> createState() {
    return _BackgroundTaskState();
  }
}

class _BackgroundTaskState extends State<BackgroundTaskProvider> {
  @override
  Widget build(BuildContext context) {
    return widget.child;
  }

  @override
  void initState() {
    super.initState();
    Workmanager.initialize(
      callbackDispatcher,
      isInDebugMode: true,
    );
  }
}
