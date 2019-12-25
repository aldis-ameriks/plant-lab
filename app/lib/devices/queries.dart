import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class DevicesQuery extends StatelessWidget {
  const DevicesQuery({@required this.builder});

  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
    options: QueryOptions(document: r'''
          query Devices {
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

class DeviceSettingsQuery extends StatelessWidget {
  const DeviceSettingsQuery({@required this.deviceId, @required this.builder});

  final String deviceId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
    options: QueryOptions(document: r'''
          query DeviceSettings($deviceId: ID!) {
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


class ReadingsQuery extends StatelessWidget {
  const ReadingsQuery({@required this.deviceId, @required this.builder});

  final String deviceId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(document: r'''
          query Readings($deviceId: ID!, $date: String) {
            device(deviceId: $deviceId) {
              id
              room
              name
            }
            lastReading(deviceId: $deviceId) {
              device_id
              time
              moisture
              temperature
              light
              battery_voltage
            }
            lastWateredTime(deviceId: $deviceId)
            readings(deviceId: $deviceId, date: $date) {
              device_id
              time
              moisture
              temperature
              light
              battery_voltage
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

          return builder(result.data, refetch);
        },
      );
}
