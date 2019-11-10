import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class LastReading extends StatelessWidget {
  const LastReading({@required this.nodeId});

  final String nodeId;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(
          document: r'''
          query LastReading($nodeId: String!) {
            lastReading(nodeId: $nodeId) {
              node_id
              time
              moisture
              temperature
              light
              battery_voltage
            }
          }
        ''',
          variables: {
            'nodeId': nodeId,
          },
        ),
        builder: (
          QueryResult result, {
          BoolCallback refetch,
          FetchMore fetchMore,
        }) {
          if (result.errors != null) {
            return Text(result.errors.toString());
          }

          if (result.loading) {
            return Center(
              child: const CircularProgressIndicator(),
            );
          }

          dynamic readings = result.data['lastReading'];

          return Column(
            children: <Widget>[
              Card(
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15)),
                color: Color.fromRGBO(237, 237, 237, 1),
                margin: EdgeInsets.all(10),
                child: Container(
                    width: (MediaQuery.of(context).size.width / 2) - 20,
                    padding: EdgeInsets.only(
                        bottom: 20, top: 20, left: 10, right: 10),
                    child: Row(
                      children: <Widget>[
                        Image(
                          image: AssetImage('assets/plant.jpg'),
                          width: 70,
                          height: 70,
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text('ID: ${readings['node_id']}'),
                            Text('M: ${readings['moisture']} %'),
                            Text('T: ${readings['temperature']} °C'),
                            Text('B: ${readings['battery_voltage']} V'),
                          ],
                        )
                      ],
                    )),
              ),
            ],
          );
        },
      );
}
