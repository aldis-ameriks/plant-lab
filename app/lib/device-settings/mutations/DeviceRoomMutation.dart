import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class DeviceRoomMutation extends StatelessWidget {
  const DeviceRoomMutation({@required this.deviceId, @required this.builder});

  final String deviceId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Mutation(
        options: MutationOptions(
            document: r'''
        mutation updateDeviceRoom($deviceId: ID!, $room: String!) {
          updateDeviceRoom(deviceId: $deviceId, room: $room) {
            id
            name
            room
            firmware
            __typename
          }
        }
      ''',
            onCompleted: (result) {
              final snackBar = SnackBar(
                content: Text('Device room updated', textAlign: TextAlign.center),
                backgroundColor: Colors.greenAccent[700],
              );
              Scaffold.of(context).showSnackBar(snackBar);
            },
            onError: (error) {
              final snackBar = SnackBar(
                content: Text('Failed to update device room', textAlign: TextAlign.center),
                backgroundColor: Colors.redAccent[700],
              );
              Scaffold.of(context).showSnackBar(snackBar);
            }),
        builder: (runMutation, result) {
          return builder(runMutation, result);
        },
      );
}
