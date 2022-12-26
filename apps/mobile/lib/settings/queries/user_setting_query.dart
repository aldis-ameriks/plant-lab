import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:plantlab/shared/delayed_page_loader.dart';

class UserSettingQuery extends StatelessWidget {
  const UserSettingQuery({@required this.name, @required this.builder});

  final String name;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(documentNode: gql(r'''
          query UserSetting($name: String!) {
            userSetting(name: $name) {
              name
              value
            }
          }
      '''), variables: {'name': name}, fetchPolicy: FetchPolicy.cacheAndNetwork),
        builder: (result, {refetch, fetchMore}) {
          if (result.hasException) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: Center(
                    child: Text(result.exception.toString(), textAlign: TextAlign.center),
                  ),
                ),
                RaisedButton(
                  padding: EdgeInsets.all(12),
                  onPressed: () {
                    refetch();
                  },
                  color: Theme.of(context).accentColor,
                  child: Text("Press to retry", style: TextStyle(color: Colors.white)),
                )
              ],
            );
          }

          if (result.loading) {
            return Center(
              child: DelayedPageLoader(),
            );
          }

          return builder(result, refetch);
        },
      );
}
