import 'package:flutter/material.dart';
import 'package:planty/readings/home.dart';

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
        child = Text('Plant database placeholder');
        break;
      case 2:
        child = Text('Settings placeholder');
        break;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Plant Monitoring'),
      ),
      body: Center(
        child: child,
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(title: Text('Home'), icon: Icon(Icons.dashboard)),
          BottomNavigationBarItem(title: Text('Plants'), icon: Icon(Icons.dns)),
          BottomNavigationBarItem(title: Text('Settings'), icon: Icon(Icons.settings)),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.green[800],
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
