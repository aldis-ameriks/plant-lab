import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

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

