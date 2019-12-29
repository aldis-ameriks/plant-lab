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
              room
              name
              firmware
              __typename
            }
          }
      ''', fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.errors != null) {
            // TODO: Show snackbar upon error
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
