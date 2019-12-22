import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class UserSensorsQuery extends StatelessWidget {
  const UserSensorsQuery({@required this.builder});

  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
          query Sensors {
            devices {
              id
              name
              room
            }
          }
      ''', fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            return Center(
              child: Text(result.errors.toString()),
            );
          }

          if (result.loading) {
            return Center(
              child: const RefreshProgressIndicator(),
            );
          }

          return builder(result.data, refetch);
        },
      );
}

class UserSensorSettingsQuery extends StatelessWidget {
  const UserSensorSettingsQuery({@required this.deviceId, @required this.builder});

  final String deviceId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
          query SensorSettings($deviceId: String!) {
            device(deviceId: $deviceId) {
              id
              room
              name
              firmware
            }
          }
      ''', variables: {'deviceId': deviceId}, fetchPolicy: FetchPolicy.cacheAndNetwork),
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
