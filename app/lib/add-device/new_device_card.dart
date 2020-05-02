import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'mutations/device_pairing_mutation.dart';

class NewDeviceCard extends StatelessWidget {
  NewDeviceCard({@required this.device});

  final dynamic device;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: () async {
          final result = await showDialog(
              context: context,
              builder: (context) => DevicePairingMutation(
                  deviceVersion: device['version'],
                  builder: (result, stopPairing) => AlertDialog(
                      scrollable: true,
                      actions: <Widget>[
                        FlatButton(
                          child: Text('Cancel', style: TextStyle(color: Colors.black)),
                          onPressed: () {
                            stopPairing();
                            Navigator.of(context).pop();
                          },
                        ),
                      ],
                      title: Text('Pairing ${device['name']}'),
                      content: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          device['pairingImage'],
                          Container(
                            child: Text(device['pairingText']),
                            margin: EdgeInsets.only(bottom: 20),
                          ),
                          CircularProgressIndicator(
                            strokeWidth: 2,
                          ),
                          Container(
                            child: Text('Pairing in progress'),
                            margin: EdgeInsets.only(top: 20),
                          )
                        ],
                      ))));

          if (result == 'failed') {
            Scaffold.of(context)
              ..removeCurrentSnackBar()
              ..showSnackBar(SnackBar(
                content: Text('Technical error occurred during pairing', textAlign: TextAlign.center),
                backgroundColor: Colors.redAccent[700],
              ));
          }
        },
        child: Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          child: Container(
              padding: EdgeInsets.all(10),
              child: Row(
                children: <Widget>[
                  Container(
                    margin: EdgeInsets.only(right: 20),
                    child: Image(
                      image: AssetImage(device['image']),
                      width: 40,
                      height: 60,
                    ),
                  ),
                  Flexible(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(device['name'], style: Theme.of(context).textTheme.body2),
                        ]),
                  )
                ],
              )),
        ),
      );
}
