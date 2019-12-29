import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'mutations/DeviceNameMutation.dart';
import 'mutations/DeviceRoomMutation.dart';
import 'queries/DeviceSettingsQuery.dart';
import 'setting.dart';

class DeviceSettings extends StatelessWidget {
  const DeviceSettings({@required this.deviceId});

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
              )),
        ],
        body: Container(
          margin: EdgeInsets.only(left: 20, right: 20),
          child: DeviceSettingsQuery(
            deviceId: deviceId,
            builder: (result, refetch) {
              dynamic device = result['device'];

              return Column(
                children: <Widget>[
                  Setting(text: 'Device ID', value: device['id'], readonly: true),
                  NameEntry(value: device['name'], deviceId: deviceId, refetch: refetch),
                  RoomEntry(value: device['room'], deviceId: deviceId, refetch: refetch),
                  Setting(text: 'Firmware', value: device['firmware'], readonly: true),
                  Divider(),
                  Container(
                    margin: EdgeInsets.only(top: 20),
                    child: Container(
                      width: 500,
//                      TODO: Implement device removal
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
}

class NameEntry extends StatelessWidget {
  const NameEntry({@required this.value, @required this.deviceId, @required this.refetch});

  final String value;
  final String deviceId;
  final Function refetch;

  @override
  Widget build(BuildContext context) {
    return DeviceNameMutation(
      deviceId: deviceId,
      builder: (runMutation, result) {
        return Setting(
            text: 'Name',
            value: value,
            readonly: false,
            loading: result.loading,
            onSubmit: (value) {
              runMutation({'name': value, 'deviceId': deviceId});
            });
      },
    );
  }
}

class RoomEntry extends StatelessWidget {
  const RoomEntry({@required this.value, @required this.deviceId, @required this.refetch});

  final String value;
  final String deviceId;
  final Function refetch;

  @override
  Widget build(BuildContext context) {
    return DeviceRoomMutation(
      deviceId: deviceId,
      builder: (runMutation, result) {
        return Setting(
            text: 'Room',
            value: value,
            readonly: false,
            loading: result.loading,
            onSubmit: (value) {
              runMutation({'room': value, 'deviceId': deviceId});
            });
      },
    );
  }
}
