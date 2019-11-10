import 'package:flutter/material.dart';
import 'package:planty/readings/sensors_list.dart';


class App extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _AppState();
}

class _AppState extends State {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    Widget child;

    switch(_selectedIndex) {
      case 0:
        child = SensorsList();
        break;
      case 1:
        child = Text('Plant database placeholder');
        break;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Planty'),
      ),
      body: Center(
        child: child,
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(title: Text('Home'), icon: Icon(Icons.home)),
          BottomNavigationBarItem(
              title: Text('Plants'), icon: Icon(Icons.data_usage))
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
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
