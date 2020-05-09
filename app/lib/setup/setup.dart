import 'package:barcode_scan/barcode_scan.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../providers/user_state_provider.dart';

class Setup extends StatefulWidget {
  @override
  _SetupState createState() => _SetupState();
}

class _SetupState extends State<Setup> {
  TextEditingController myController;
  String barcodeError;

  @override
  void initState() {
    super.initState();
    myController = new TextEditingController(text: '');
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<UserState>(
      builder: (context, userState, _) {
        Future scan() async {
          try {
            String barcode = await BarcodeScanner.scan();
            userState.authenticate(barcode);
          } on PlatformException catch (e) {
            if (e.code == BarcodeScanner.CameraAccessDenied) {
              setState(() {
                this.barcodeError = 'Missing camera permission.';
              });
            } else {
              setState(() => this.barcodeError = 'Unknown error: $e');
            }
          } catch (e) {
            setState(() => this.barcodeError = 'Unknown error: $e');
          }
        }

        String error = userState.error ?? barcodeError;
        return Scaffold(
            body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Container(child: Text('Missing access key'), margin: EdgeInsets.only(bottom: 20)),
              error != null
                  ? Container(child: Text(error), margin: EdgeInsets.only(bottom: 20))
                  : Container(),
              RaisedButton(
                child: const Text('Scan QR code'),
                onPressed: scan,
              ),
              Container(child: Text('or')),
              RaisedButton(
                child: const Text('Enter access key'),
                onPressed: () {
                  showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                              actions: <Widget>[
                                FlatButton(
                                  child: Text('Cancel', style: TextStyle(color: Colors.black)),
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                  },
                                ),
                                FlatButton(
                                  child: Text('Submit', style: TextStyle(color: Colors.black)),
                                  onPressed: () async {
                                    await userState.authenticate(myController.text);
                                    Navigator.of(context).pop();
                                  },
                                )
                              ],
                              title: Text('Enter access key'),
                              content: Container(
                                width: MediaQuery.of(context).size.width - 24,
                                child: Form(
                                  key: GlobalKey(),
                                  child: Padding(
                                      padding: EdgeInsets.all(8.0),
                                      child: TextFormField(
                                          decoration: InputDecoration(border: OutlineInputBorder()),
                                          controller: myController)),
                                ),
                              )));
                },
              ),
            ],
          ),
        ));
      },
    );
  }
}
