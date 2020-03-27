import 'package:aa.iot/setup/setup.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'devices/devices.dart';
import 'settings/settings.dart';

class App extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _AppState();
}

class _AppState extends State {
  int _selectedIndex = 0;
  String _accessKey;

  @override
  initState() {
    super.initState();
    initAccessKey();
  }

  initAccessKey() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _accessKey = prefs.getString("access_key");
    });
  }

  Future<void> setAccessKey(accessKey) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("access_key", accessKey);
    setState(() {
      _accessKey = accessKey;
      _selectedIndex = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    print(_accessKey);
    if (_accessKey == null) {
      return Setup(setAccessKey: setAccessKey);
    }

    Widget child;
    switch (_selectedIndex) {
      case 0:
        child = Home();
        break;
      case 1:
        child = Settings(setAccessKey: setAccessKey);
        break;
    }

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(title: Text('Devices'), icon: Icon(Icons.dashboard)),
          BottomNavigationBarItem(title: Text('Settings'), icon: Icon(Icons.settings)),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Theme.of(context).accentColor,
        onTap: _onItemTapped,
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
}
