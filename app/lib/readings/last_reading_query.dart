import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class LastReading extends StatelessWidget {
  const LastReading({@required this.nodeId});

  final String nodeId;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(
          document: r'''
          query LastReading($nodeId: String!) {
            lastReading(nodeId: $nodeId) {
              node_id
              time
              moisture
              temperature
              light
              battery_voltage
            }
          }
        ''',
          variables: {
            'nodeId': nodeId,
          },
        ),
        builder: (
          QueryResult result, {
          BoolCallback refetch,
          FetchMore fetchMore,
        }) {
          if (result.errors != null) {
            return Text(result.errors.toString());
          }

          if (result.loading) {
            return Center(
              child: const CircularProgressIndicator(),
            );
          }

          return Column(
            children: <Widget>[
              Text(JsonEncoder.withIndent('  ')
                  .convert(result.data['lastReading'])),
              RaisedButton(
                onPressed: refetch,
                child: const Text('REFETCH'),
              ),
            ],
          );
        },
      );
}
