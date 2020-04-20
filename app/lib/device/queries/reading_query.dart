import 'package:aa.iot/delayed_loader.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ReadingsQuery extends StatelessWidget {
  const ReadingsQuery({@required this.deviceId, @required this.builder});

  final String deviceId;
  final dynamic builder;

  @override
  Widget build(BuildContext context) => Query(
        options: QueryOptions(documentNode: gql(r'''
          query Readings($deviceId: ID!, $date: String) {
            device(deviceId: $deviceId) {
              id
              room
              name
              type
              version
              __typename
            }
            lastReading(deviceId: $deviceId) {
              device_id
              time
              moisture
              temperature
              light
              battery_voltage
            }
            lastWateredTime(deviceId: $deviceId)
            readings(deviceId: $deviceId, date: $date) {
              device_id
              time
              moisture
              temperature
              light
              battery_voltage
            }
          }
      '''), variables: {'deviceId': deviceId}),
        builder: (result, {refetch, fetchMore}) {
          if (result.hasException) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: Center(
                    child: Text(result.exception.toString(),
                        textAlign: TextAlign.center),
                  ),
                ),
                RaisedButton(
                  padding: EdgeInsets.all(12),
                  onPressed: () {
                    refetch();
                  },
                  color: Theme.of(context).accentColor,
                  child: Text("Press to retry",
                      style: TextStyle(color: Colors.white)),
                )
              ],
            );
          }

          if (result.loading) {
            return Center(
              child: DelayedLoader(),
            );
          }

          return builder(result.data, refetch);
        },
      );
}
