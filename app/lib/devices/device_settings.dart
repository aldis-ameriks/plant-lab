import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'queries.dart';

class SensorSettings extends StatelessWidget {
  const SensorSettings({@required this.deviceId});

  final String deviceId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxScrolled) => [
          SliverAppBar(
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: Text('Device $deviceId', style: Theme.of(context).textTheme.title),
              ),
              actions: <Widget>[
                IconButton(
                    icon: Icon(Icons.settings),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => SensorSettings(deviceId: deviceId)),
                      );
                    }),
              ]),
        ],
        body: Container(
          margin: EdgeInsets.only(left: 20, right: 20),
          child: DeviceSettingsQuery(
            deviceId: deviceId,
            builder: (result) {
              dynamic device = result['device'];

              return Column(
                children: <Widget>[
                  _buildEntry('Device ID', device['id'], readonly: true),
                  _buildEntry('Name', device['name']),
                  _buildEntry('Room', device['room']),
                  _buildEntry('Firmware', device['firmware'], readonly: true),
                  Divider(),
                  Container(
                    margin: EdgeInsets.only(top: 20),
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
      ),
    );
  }

  _buildEntry(text, value, {bool readonly: false}) {
    value ??= '';
    return Column(
      children: <Widget>[
        Divider(),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Flex(
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
          ),
        )
      ],
    );
  }
}
