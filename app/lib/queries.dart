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

class PlantsQuery extends StatelessWidget {
  const PlantsQuery({@required this.builder});

  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
          query Plants {
            plants {
              id
              name
            }
          }
      ''', fetchPolicy: FetchPolicy.cacheAndNetwork),
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

class PlantQuery extends StatelessWidget {
  const PlantQuery({@required this.plantId, @required this.builder});

  final String plantId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
          query Plant($plantId: String!) {
            plant(plantId: $plantId) {
              id
              name
              description
            }
          }
      ''', variables: {'plantId': plantId}, fetchPolicy: FetchPolicy.cacheAndNetwork),
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

class UserSensorsQuery extends StatelessWidget {
  const UserSensorsQuery({@required this.builder});

  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
          query Sensors {
            sensors {
              id
              room
              plant {
                id
                name
                description
              }
              lastReading {
                sensor_id
                time
                moisture
                temperature
                light
                battery_voltage
              }
            }
          }
      ''', fetchPolicy: FetchPolicy.cacheAndNetwork),
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
