import 'dart:async';

import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class DevicePairingMutation extends StatelessWidget {
  const DevicePairingMutation({@required this.builder, @required this.deviceVersion});

  final dynamic builder;
  final String deviceVersion;

  @override
  Widget build(BuildContext context) => Mutation(
        options: MutationOptions(
            documentNode: gql(r'''
          mutation pairDevice($input: PairDeviceInput!) {
            pairDevice(input: $input)
          }
      '''),
            fetchPolicy: FetchPolicy.noCache,
            onCompleted: (result) {
              if (result != null && result['pairDevice'] == true) {
                Navigator.of(context)..pop()..pop('paired');
              }
            },
            onError: (error) {
              Navigator.of(context).pop('failed');
            }),
        builder: (runMutation, QueryResult result) => StateContainer(
          mutation: runMutation,
          result: result,
          builder: builder,
          deviceVersion: deviceVersion,
        ),
      );
}

class StateContainer extends StatefulWidget {
  const StateContainer(
      {@required this.builder, @required this.mutation, @required this.result, @required this.deviceVersion});

  final dynamic builder;
  final dynamic mutation;
  final dynamic result;
  final String deviceVersion;

  @override
  _StateContainerState createState() => _StateContainerState();
}

class _StateContainerState extends State<StateContainer> {
  bool isPairing = false;
  Timer interval;

  @override
  void initState() {
    super.initState();
    this.startPairing();
  }

  @override
  Widget build(BuildContext context) {
    return widget.builder(widget.result, this.stopPairing);
  }

  @override
  void dispose() {
    super.dispose();
    if (this.isPairing || (this.interval != null && this.interval.isActive)) {
      this.interval.cancel();
    }
  }

  void startPairing() {
    setState(() {
      if (!this.isPairing || (this.interval != null && !this.interval.isActive)) {
        this.interval = Timer.periodic(Duration(seconds: 2), (timer) {
          widget.mutation({
            'input': {'version': widget.deviceVersion}
          });
        });
      }
      this.isPairing = true;
    });
  }

  void stopPairing() {
    setState(() {
      if (this.isPairing || (this.interval != null && this.interval.isActive)) {
        this.interval.cancel();
      }
      this.isPairing = false;
    });
  }
}
