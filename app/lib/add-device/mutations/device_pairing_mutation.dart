import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class DevicePairingMutation extends StatelessWidget {
  const DevicePairingMutation({@required this.builder});

  final dynamic builder;

  @override
  Widget build(BuildContext context) => Mutation(
        options: MutationOptions(
            documentNode: gql(r'''
          mutation pairDevice($input: PairDeviceInput!) {
            pairDevice(input: $input)
          }
      '''),
            onCompleted: (result) {
              final snackBar = SnackBar(
                content: Text('Device has been paired', textAlign: TextAlign.center),
                backgroundColor: Colors.greenAccent[700],
              );
              Scaffold.of(context).showSnackBar(snackBar);
            },
            onError: (error) {
              final snackBar = SnackBar(
                content: Text('Failed to pair device', textAlign: TextAlign.center),
                backgroundColor: Colors.redAccent[700],
              );
              Scaffold.of(context).showSnackBar(snackBar);
            }),
        builder: (runMutation, result) {
          return builder(runMutation, result);
        },
      );
}
