import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class UserSettingMutation extends StatelessWidget {
  const UserSettingMutation({@required this.builder, this.refetch});

  final dynamic builder;
  final dynamic refetch;

  @override
  Widget build(BuildContext context) => Mutation(
        options: MutationOptions(
            documentNode: gql(r'''
        mutation updateUserSetting($input: UserSettingInput!) {
          updateUserSetting(input: $input) {
            name
            value
          }
        }
      '''),
            fetchPolicy: FetchPolicy.noCache,
            onCompleted: (result) {
              final snackBar = SnackBar(
                content: Text('User setting updated', textAlign: TextAlign.center),
                backgroundColor: Colors.greenAccent[700],
              );
              if (this.refetch != null) {
                refetch();
              }
              Scaffold.of(context).showSnackBar(snackBar);
            },
            onError: (error) {
              final snackBar = SnackBar(
                content: Text('Failed to update user setting', textAlign: TextAlign.center),
                backgroundColor: Colors.redAccent[700],
              );
              Scaffold.of(context).showSnackBar(snackBar);
            }),
        builder: (runMutation, result) {
          return builder(runMutation, result);
        },
      );
}
