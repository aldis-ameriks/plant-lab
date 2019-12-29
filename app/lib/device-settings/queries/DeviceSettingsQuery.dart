import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

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
              __typename
            }
          }
      ''', variables: {'deviceId': deviceId}),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            // TODO: Show snackbar upon error
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
