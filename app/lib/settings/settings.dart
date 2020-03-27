import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Settings extends StatelessWidget {
  const Settings({@required this.setAccessKey});

  final void Function(String accessKey) setAccessKey;

  @override
  Widget build(BuildContext context) {
    List<Widget> entries = [
      _buildEntry('Email', 'foo@bar.com'),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('User settings', style: Theme.of(context).textTheme.title),
      ),
      body: Container(
        color: Colors.grey[300],
        child: Column(
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
                  onPressed: () async {
                    SharedPreferences prefs = await SharedPreferences.getInstance();
                    prefs.remove("access_key");
                    setAccessKey(null);
                  },
                  color: Colors.red[700],
                  child: Text("Sign out", style: TextStyle(color: Colors.white)),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  _buildEntry(text, value) {
    return Flex(
      direction: Axis.horizontal,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Text(text),
        Row(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(right: 10),
              child: Container(
                width: 180,
                child: Text(value, overflow: TextOverflow.ellipsis, textAlign: TextAlign.right),
              ),
            ),
            Icon(Icons.chevron_right, color: Colors.grey[600])
          ],
        ),
      ],
    );
  }
}
