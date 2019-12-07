import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class UserSensorsQuery extends StatelessWidget {
  const UserSensorsQuery({@required this.builder});

  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
    options: QueryOptions(document: r'''
          query Sensors {
            sensors {
              id
              name
              room
              plant {
                id
                name
                description
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

class UserSensorSettingsQuery extends StatelessWidget {
  const UserSensorSettingsQuery({@required this.sensorId, @required this.builder});

  final String sensorId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
    options: QueryOptions(document: r'''
          query SensorSettings($sensorId: String!) {
            sensor(sensorId: $sensorId) {
              id
              room
              name
              firmware
              location
              plant {
                id
                name
                description
              }
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
