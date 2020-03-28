import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../user_state_provider.dart';

class Setup extends StatefulWidget {
  @override
  _SetupState createState() => _SetupState();
}

class _SetupState extends State<Setup> {
  TextEditingController myController;

  @override
  void initState() {
    super.initState();
    myController = new TextEditingController(text: "");
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<UserState>(
      builder: (context, userState, _) => Scaffold(
          body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Container(child: Text("Missing access key"), margin: EdgeInsets.only(bottom: 20)),
            RaisedButton(
              child: const Text('Scan QR code'),
              onPressed: () {},
            ),
            RaisedButton(
              child: const Text('Enter access key'),
              onPressed: () {
                showDialog(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                          actions: <Widget>[
                            FlatButton(
                              child: Text('Cancel', style: TextStyle(color: Colors.black)),
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                            ),
                            FlatButton(
                              child: Text('Submit', style: TextStyle(color: Colors.black)),
                              onPressed: () {
                                userState.setAccessKey(myController.text);
                                Navigator.of(context).pop();
                              },
                            )
                          ],
                          title: Text('Enter access key'),
                          content: Form(
                            key: GlobalKey(),
                            child:
                                Padding(padding: EdgeInsets.all(8.0), child: TextFormField(controller: myController)),
                          ));
                    });
              },
            ),
          ],
        ),
      )),
    );
  }
}
