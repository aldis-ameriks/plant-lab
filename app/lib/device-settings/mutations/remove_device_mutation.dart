import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class RemoveDeviceMutation extends StatelessWidget {
  const RemoveDeviceMutation({@required this.builder});

  final dynamic builder;

  @override
  Widget build(BuildContext context) => Mutation(
        options: MutationOptions(
            documentNode: gql(r'''
          mutation removeDevice($deviceId: ID!) {
            removeDevice(deviceId: $deviceId)
          }
      '''),
            onCompleted: (result) {
              Navigator.of(context)..pop()..pop('removed');
            },
            onError: (error) {
              final snackBar = SnackBar(
                content: Text('Failed to remove device', textAlign: TextAlign.center),
                backgroundColor: Colors.redAccent[700],
              );
              Scaffold.of(context).showSnackBar(snackBar);
            }),
        builder: (runMutation, result) {
          return builder(runMutation, result);
        },
      );
}
