import 'package:flutter/cupertino.dart';

class HubDetails extends StatelessWidget {
  HubDetails({@required this.result});

  final dynamic result;

  @override
  Widget build(BuildContext context) {
    String name = result['device']['name'] ?? '';
    String room = result['device']['room'] ?? '';

    return ListView(
      padding: EdgeInsets.all(10),
      children: <Widget>[
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(right: 30),
              child: Image(
                image: AssetImage('assets/${result['device']['version']}.png'),
                width: 100,
                height: 80,
              ),
            ),
            Column(
              children: <Widget>[Text(name), Text(room)],
            )
          ],
        ),
      ],
    );
  }
}
