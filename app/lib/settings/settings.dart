import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../user_state_provider.dart';

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
                      Divider(),
                      Container(
                        margin: EdgeInsets.only(top: 20),
                        child: Container(
                          width: 500,
                          child: RaisedButton(
                            padding: EdgeInsets.all(12),
                            onPressed: () {
                              userState.removeAccessKey();
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
