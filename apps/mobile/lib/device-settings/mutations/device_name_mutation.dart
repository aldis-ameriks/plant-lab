import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class DeviceNameMutation extends StatelessWidget {
  const DeviceNameMutation({@required this.deviceId, @required this.builder});

  final String deviceId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Mutation(
        options: MutationOptions(
            documentNode: gql(r'''
          mutation updateDeviceName($deviceId: ID!, $name: String!) {
            updateDeviceName(deviceId: $deviceId, name: $name) {
              id
              name
              room
              firmware
              __typename
            }
          }
      '''),
            onCompleted: (result) {
              final snackBar = SnackBar(
                content:
                    Text('Device name updated', textAlign: TextAlign.center),
                backgroundColor: Colors.greenAccent[700],
              );
              Scaffold.of(context).showSnackBar(snackBar);
            },
            onError: (error) {
              final snackBar = SnackBar(
                content: Text('Failed to update device name',
                    textAlign: TextAlign.center),
                backgroundColor: Colors.redAccent[700],
              );
              Scaffold.of(context).showSnackBar(snackBar);
            }),
        builder: (runMutation, result) {
          return builder(runMutation, result);
        },
      );
}
