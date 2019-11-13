import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class LastReadingQuery extends StatelessWidget {
  const LastReadingQuery({@required this.nodeId, @required this.builder});

  final String nodeId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
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
      ''', variables: {'nodeId': nodeId}, fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            return Text(result.errors.toString());
          }

          if (result.loading) {
            return Center(
              child: const CircularProgressIndicator(),
            );
          }

          return builder(result.data);
        },
      );
}

class ReadingsQuery extends StatelessWidget {
  const ReadingsQuery({@required this.nodeId, @required this.builder});

  final String nodeId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
            query Readings($nodeIds: [String!]!, $date: String) {
              readings(nodeIds: $nodeIds, date: $date) {
                node_id
                time
                moisture
                temperature
                light
                battery_voltage
              }
            }
      ''', variables: {
          'nodeIds': [nodeId]
        }, fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            return Text(result.errors.toString());
          }

          if (result.loading) {
            return Center(
              child: const CircularProgressIndicator(),
            );
          }

          // TODO: Fetching readings for multiple sensors is unnecessary
          // TODO: Refactor schema to receive single "nodeId" instead
          return builder(result.data['readings'][0]);
        },
      );
}

class LastWateredQuery extends StatelessWidget {
  const LastWateredQuery({@required this.nodeId, @required this.builder});

  final String nodeId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
            query LastWateredTime($nodeId: String!) {
              lastWateredTime(nodeId: $nodeId)
            }
      ''', variables: {'nodeId': nodeId}, fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            return Text(result.errors.toString());
          }

          if (result.loading) {
            return Center(
              child: const CircularProgressIndicator(),
            );
          }

          return builder(result.data);
        },
      );
}
