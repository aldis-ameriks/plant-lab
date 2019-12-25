import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'queries.dart';

class SensorSettings extends StatelessWidget {
  const SensorSettings({@required this.deviceId});

  final String deviceId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Device settings'),
      ),
      body: Container(
        color: Colors.grey[300],
        child: DeviceSettingsQuery(
          deviceId: deviceId,
          builder: (result) {
            dynamic device = result['device'];

            List<Widget> entries = [
              _buildEntry('Device ID', device['id'], readonly: true),
              _buildEntry('Name', device['name']),
              _buildEntry('Room', device['room']),
              _buildEntry('Firmware', device['firmware'], readonly: true),
            ];

            return Column(
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
                      padding: EdgeInsets.all(12),
                      onPressed: () {},
                      color: Colors.red[700],
                      child: Text("Remove", style: TextStyle(color: Colors.white)),
                    ),
                  ),
                )
              ],
            );
          },
        ),
      ),
    );
  }

  _buildEntry(text, value, {bool readonly: false}) {
    value ??= '';
    return Flex(
      direction: Axis.horizontal,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Text(text),
        Row(
          children: <Widget>[
            Padding(
                padding: EdgeInsets.only(right: 10),
                child: Container(
                  width: 180,
                  child: Text(value, overflow: TextOverflow.ellipsis, textAlign: TextAlign.right),
                )),
            Opacity(opacity: readonly ? 0 : 1, child: Icon(Icons.chevron_right, color: Colors.grey[600]))
          ],
        ),
      ],
    );
  }
}
