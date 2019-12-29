import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class DeviceNameMutation extends StatelessWidget {
  const DeviceNameMutation({@required this.deviceId, @required this.builder});

  final String deviceId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Mutation(
        options: MutationOptions(document: r'''
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
        builder: (runMutation, result) {
          // TODO: Show snackbar upon error
          return builder(runMutation, result);
        },
      );
}
