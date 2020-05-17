import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:plantlab/settings/queries/user_setting_query.dart';
import 'package:plantlab/shared/setting.dart';
import 'package:provider/provider.dart';

import '../providers/user_state_provider.dart';
import 'mutations/user_setting_mutation.dart';

class Settings extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Consumer<UserState>(
      builder: (context, userState, _) => Scaffold(
            body: NestedScrollView(
              headerSliverBuilder: (context, innerBoxScrolled) => [
                SliverAppBar(
                    pinned: true,
                    flexibleSpace: FlexibleSpaceBar(
                      title: Text('User settings', style: Theme.of(context).textTheme.title),
                    )),
              ],
              body: Container(
                  margin: EdgeInsets.only(left: 20, right: 20),
                  child: (Column(
                    children: <Widget>[
                      UserSettingEntry(name: 'notifications', title: 'Device notifications'),
                      Container(
                        margin: EdgeInsets.only(top: 40),
                        child: Container(
                          width: 500,
                          child: RaisedButton(
                            padding: EdgeInsets.all(12),
                            onPressed: () {
                              userState.logout();
                            },
                            color: Colors.red[700],
                            child: Text("Sign out", style: TextStyle(color: Colors.white)),
                          ),
                        ),
                      )
                    ],
                  ))),
            ),
          ));
}

class UserSettingEntry extends StatelessWidget {
  UserSettingEntry({@required this.name, @required this.title});

  final String title;
  final String name;

  @override
  Widget build(BuildContext context) {
    return UserSettingQuery(
      name: name,
      builder: (queryResult, _refetch) {
        return UserSettingMutation(
          builder: (runMutation, mutationResult) {
            return Setting(
                text: title,
                value: mutationResult.data != null
                    ? mutationResult.data['updateUserSetting']['value']
                    : queryResult['userSetting'] != null ? queryResult['userSetting']['value'] : '',
                readonly: false,
                loading: mutationResult.loading,
                onSubmit: (value) {
                  runMutation({
                    'input': {'name': name, 'value': value}
                  });
                });
          },
        );
      },
    );
  }
}
