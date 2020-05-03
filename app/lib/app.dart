import 'package:plantlab/delayed_loader.dart';
import 'package:plantlab/setup/setup.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'devices/devices.dart';
import 'settings/settings.dart';
import 'user_state_provider.dart';

class App extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _AppState();
}

class _AppState extends State {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Consumer<UserState>(builder: (context, userState, _) {
      if (userState.isUninitialized()) {
        return Scaffold(body: Center(child: DelayedLoader(delay: 1000)));
      }

      if (userState.isAnonymous()) {
        return Setup();
      }

      Widget child;
      switch (_selectedIndex) {
        case 0:
          child = Home();
          break;
        case 1:
          child = Settings();
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
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
}
