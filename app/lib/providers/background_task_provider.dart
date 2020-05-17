import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workmanager/workmanager.dart';

import '../config.dart';

class Notification {
  final String id;
  final String title;
  final String body;

  Notification({@required this.id, @required this.title, @required this.body});

  factory Notification.fromJson(Map<String, dynamic> json) {
    return Notification(
      id: json['id'] as String,
      title: json['title'] as String,
      body: json['body'] as String,
    );
  }
}

Future<List<Notification>> fetchNotifications(String accessKey) async {
  String url = '${config['backend']['endpoint']}/notifications/new';
  http.Response res = await http.get(url, headers: {'access-key': accessKey});
  Map<String, dynamic> parsed = json.decode(res.body);
  return parsed['data'].map<Notification>((json) => Notification.fromJson(json)).toList();
}

Future<void> showNotification(String deviceId, String title, String body) async {
  // TODO: Update fields for Android devices
  var androidPlatformChannelSpecifics = AndroidNotificationDetails(
      'your channel id', 'your channel name', 'your channel description',
      importance: Importance.Max, priority: Priority.High, ticker: 'ticker');
  var iOSPlatformChannelSpecifics = IOSNotificationDetails();
  var platformChannelSpecifics = NotificationDetails(androidPlatformChannelSpecifics, iOSPlatformChannelSpecifics);
  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
  await flutterLocalNotificationsPlugin.show(0, title, body, platformChannelSpecifics, payload: deviceId);
}

void callbackDispatcher() {
  Workmanager.executeTask((task, inputData) async {
    print('Task triggered: $task');
    switch (task) {
      case Workmanager.iOSBackgroundTask:
        try {
          SharedPreferences prefs = await SharedPreferences.getInstance();
          String accessKey = prefs.getString("access_key");
          if (accessKey != null) {
            List<Notification> notifications = await fetchNotifications(accessKey);
            notifications.forEach((element) {
              showNotification(element.id, element.title, element.body);
            });
          }
        } catch (e) {
          print(e);
        }

        print("The iOS background fetch was triggered");
        break;
    }
    return Future.value(true);
  });
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
