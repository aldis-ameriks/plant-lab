import 'package:flutter/material.dart';
import 'package:planty/plants/plants.dart';
import 'package:planty/readings/home.dart';
import 'package:planty/settings/settings.dart';

class App extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _AppState();
}

class _AppState extends State {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    Widget child;

    switch (_selectedIndex) {
      case 0:
        child = Home();
        break;
      case 1:
        child = Plants();
        break;
      case 2:
        child = Settings();
        break;
    }

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(title: Text('Devices'), icon: Icon(Icons.dashboard)),
          BottomNavigationBarItem(title: Text('Plants'), icon: Icon(Icons.dns)),
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
