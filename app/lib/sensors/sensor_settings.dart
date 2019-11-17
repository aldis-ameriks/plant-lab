import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SensorSettings extends StatelessWidget {
  const SensorSettings({@required this.sensorId});

  final String sensorId;

  @override
  Widget build(BuildContext context) {
    List<Widget> entries = [
      _buildEntry('Name', 'Plant Monitoring Sensor'),
      _buildEntry('Plant', 'Rubber Tree'),
      _buildEntry('Location', 'Current location for sensor'),
      _buildEntry('Firmware', 'v1.0'),
      _buildEntry('About', ''),
      _buildEntry('Troubleshoot', ''),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('Sensor settings'),
      ),
      body: Container(
        color: Colors.grey[300],
        child: Column(
          children: <Widget>[
            Container(
              margin: EdgeInsets.only(top: 10),
              color: Colors.white,
              child: ListView.separated(
                shrinkWrap: true,
                padding: const EdgeInsets.all(10),
                itemCount: entries.length,
                itemBuilder: (BuildContext context, int index) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 12, bottom: 12, left: 24),
                    child: entries[index],
                  );
                },
                separatorBuilder: (BuildContext context, int index) => const Divider(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Container(
                width: 500,
                child: RaisedButton(
                  onPressed: () {},
                  color: Colors.red[700],
                  child: Text("Remove", style: TextStyle(color: Colors.white)),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  _buildEntry(text, value) {
    return Flex(
      direction: Axis.horizontal,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Text(text),
        Row(
          children: <Widget>[
            Container(
              width: 180,
              child: Text(value, overflow: TextOverflow.ellipsis, textAlign: TextAlign.right),
            ),
            Icon(Icons.chevron_right, color: Colors.grey[600])
          ],
        ),
      ],
    );
  }
}
