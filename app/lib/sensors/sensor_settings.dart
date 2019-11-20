import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:planty/queries.dart';

class SensorSettings extends StatelessWidget {
  const SensorSettings({@required this.sensorId});

  final String sensorId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sensor settings'),
      ),
      body: Container(
        color: Colors.grey[300],
        child: UserSensorSettingsQuery(
          sensorId: sensorId,
          builder: (result) {
            dynamic sensor = result['sensor'];

            List<Widget> entries = [
              _buildEntry('Sensor ID', sensor['id']),
              _buildEntry('Name', sensor['name']),
              _buildEntry('Plant', sensor['plant']['name']),
              _buildEntry('Location', sensor['location']),
              _buildEntry('Firmware', sensor['firmware']),
            ];

            return Column(
              children: <Widget>[
                Container(
                  margin: EdgeInsets.only(top: 10),
                  color: Colors.white,
                  child: ListView.separated(
                    shrinkWrap: true,
                    padding: const EdgeInsets.all(10),
                    itemCount: entries.length,
                    itemBuilder: (BuildContext context, int index) {
                      return Padding(
                        padding: const EdgeInsets.only(top: 12, bottom: 12, left: 24),
                        child: entries[index],
                      );
                    },
                    separatorBuilder: (BuildContext context, int index) => const Divider(),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Container(
                    width: 500,
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
    );
  }

  _buildEntry(text, value) {
    value ??= '';
    return Flex(
      direction: Axis.horizontal,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Text(text),
        Row(
          children: <Widget>[
            Padding(
                padding: EdgeInsets.only(right: 10),
                child: Container(
                  width: 180,
                  child: Text(value, overflow: TextOverflow.ellipsis, textAlign: TextAlign.right),
                )),
            Icon(Icons.chevron_right, color: Colors.grey[600])
          ],
        ),
      ],
    );
  }
}
