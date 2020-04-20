import 'package:flutter/material.dart';

import '../device/device_details.dart';

class DeviceCard extends StatelessWidget {
  const DeviceCard({@required this.device});

  final dynamic device;

  @override
  Widget build(BuildContext context) {
    String deviceId = device['id'];
    String name = device['name'];
    String room = device['room'];

    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => DeviceDetails(deviceId: deviceId)),
      ),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        child: Container(
            padding: EdgeInsets.all(10),
            child: Row(
              children: <Widget>[
                Container(
                  margin: EdgeInsets.only(right: 20),
                  child: Image(
                    image: AssetImage('assets/${device['version']}.png'),
                    width: 40,
                    height: 60,
                  ),
                ),
                Flexible(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(name ?? '', style: Theme.of(context).textTheme.body2),
                        Text('ID: $deviceId', style: Theme.of(context).textTheme.body2),
                        Text(room ?? '', style: Theme.of(context).textTheme.body2),
                      ]),
                )
              ],
            )),
      ),
    );
  }
}
