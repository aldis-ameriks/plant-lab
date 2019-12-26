import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'mutations.dart';
import 'queries.dart';

class SensorSettings extends StatelessWidget {
  const SensorSettings({@required this.deviceId});

  final String deviceId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxScrolled) => [
          SliverAppBar(
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: Text('Device $deviceId', style: Theme.of(context).textTheme.title),
              ),
              actions: <Widget>[
                IconButton(
                    icon: Icon(Icons.settings),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => SensorSettings(deviceId: deviceId)),
                      );
                    }),
              ]),
        ],
        body: Container(
          margin: EdgeInsets.only(left: 20, right: 20),
          child: DeviceSettingsQuery(
            deviceId: deviceId,
            builder: (result, refetch) {
              dynamic device = result['device'];

              return Column(
                children: <Widget>[
                  Entry(text: 'Device ID', value: device['id'], readonly: true),
                  NameEntry(value: device['name'], deviceId: deviceId, refetch: refetch),
                  RoomEntry(value: device['room'], deviceId: deviceId, refetch: refetch),
                  Entry(text: 'Firmware', value: device['firmware'], readonly: true),
                  Divider(),
                  Container(
                    margin: EdgeInsets.only(top: 20),
                    child: Container(
                      width: 500,
//                      TODO: Implement device removal
                      child: RaisedButton(
                        padding: EdgeInsets.all(12),
                        onPressed: () {},
                        color: Colors.red[700],
                        child: Text("Remove", style: TextStyle(color: Colors.white)),
                      ),
                    ),
                  )
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}

class NameEntry extends StatelessWidget {
  const NameEntry({@required this.value, @required this.deviceId, @required this.refetch});

  final String value;
  final String deviceId;
  final Function refetch;

  @override
  Widget build(BuildContext context) {
    return DeviceNameMutation(
      deviceId: deviceId,
      builder: (runMutation, result) {
        return Entry(
            text: 'Name',
            value: value,
            readonly: false,
            onSubmit: (value) {
              runMutation({'name': value, 'deviceId': deviceId});
              refetch();
            });
      },
    );
  }
}

class RoomEntry extends StatelessWidget {
  const RoomEntry({@required this.value, @required this.deviceId, @required this.refetch});

  final String value;
  final String deviceId;
  final Function refetch;

  @override
  Widget build(BuildContext context) {
    return DeviceRoomMutation(
      deviceId: deviceId,
      builder: (runMutation, result) {
        return Entry(
            text: 'Room',
            value: value,
            readonly: false,
            onSubmit: (value) {
              runMutation({'room': value, 'deviceId': deviceId});
              refetch();
            });
      },
    );
  }
}

class Entry extends StatefulWidget {
  const Entry({@required this.text, @required this.value, this.readonly: false, this.onSubmit});

  final String text;
  final String value;
  final bool readonly;
  final Function onSubmit;

  @override
  EntryState createState() => EntryState();
}

class EntryState extends State<Entry> {
  TextEditingController myController;

  @override
  void dispose() {
    myController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    myController = new TextEditingController(text: widget.value);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Divider(),
        GestureDetector(
          onTap: () {
            if (widget.readonly) {
              return;
            }
            showDialog(
                context: context,
                builder: (context) {
                  return AlertDialog(
                      actions: <Widget>[
                        FlatButton(
                          child: Text('Cancel'),
                          onPressed: () {
                            Navigator.of(context).pop();
                          },
                        ),
                        FlatButton(
                          child: Text('Submit'),
                          onPressed: () {
                            print(myController.text);
                            widget.onSubmit(myController.text);
                            Navigator.of(context).pop();
                          },
                        )
                      ],
                      title: Text('Update ${widget.text}'),
                      content: Form(
                        key: GlobalKey(),
                        child: Padding(padding: EdgeInsets.all(8.0), child: TextFormField(controller: myController)),
                      ));
                });
          },
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Flex(
              direction: Axis.horizontal,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(widget.text),
                Row(
                  children: <Widget>[
                    Padding(
                        padding: EdgeInsets.only(right: 10),
                        child: Container(
                          width: 180,
                          child: Text(myController.text ?? '',
                              overflow: TextOverflow.ellipsis, textAlign: TextAlign.right),
                        )),
                    Opacity(opacity: widget.readonly ? 0 : 1, child: Icon(Icons.chevron_right, color: Colors.grey[600]))
                  ],
                ),
              ],
            ),
          ),
        )
      ],
    );
  }
}
