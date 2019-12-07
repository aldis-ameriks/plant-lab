import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class LastReadingQuery extends StatelessWidget {
  const LastReadingQuery({@required this.sensorId, @required this.builder});

  final String sensorId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
            query LastReading($sensorId: String!) {
              lastReading(sensorId: $sensorId) {
                sensor_id
                time
                moisture
                temperature
                light
                battery_voltage
              }
            }
      ''', variables: {'sensorId': sensorId}, fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            return Center(child: Text(result.errors.toString()));
          }

          if (result.loading) {
            return Center(
              child: const RefreshProgressIndicator(),
            );
          }

          return builder(result.data);
        },
      );
}

class ReadingsQuery extends StatelessWidget {
  const ReadingsQuery({@required this.sensorId, @required this.builder});

  final String sensorId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
            query Readings($sensorId: String!, $date: String) {
              readings(sensorId: $sensorId, date: $date) {
                sensor_id
                time
                moisture
                temperature
                light
                battery_voltage
              }
            }
      ''', variables: {'sensorId': sensorId}, fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            return Center(child: Text(result.errors.toString()));
          }

          if (result.loading) {
            return Center(
              child: const RefreshProgressIndicator(),
            );
          }

          return builder(result.data);
        },
      );
}

class LastWateredQuery extends StatelessWidget {
  const LastWateredQuery({@required this.sensorId, @required this.builder});

  final String sensorId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
            query LastWateredTime($sensorId: String!) {
              lastWateredTime(sensorId: $sensorId)
            }
      ''', variables: {'sensorId': sensorId}, fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            return Center(child: Text(result.errors.toString()));
          }

          if (result.loading) {
            return Center(
              child: const RefreshProgressIndicator(),
            );
          }

          return builder(result.data);
        },
      );
}
