import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

import 'user_state_provider.dart';

final OptimisticCache cache = OptimisticCache(
  dataIdFromObject: typenameDataIdFromObject,
);

ValueNotifier<GraphQLClient> clientFor({
  @required String uri,
  String accessKey,
  String subscriptionUri,
}) {
  Link link = HttpLink(uri: uri, headers: {"access-key": accessKey});

  if (subscriptionUri != null) {
    final WebSocketLink websocketLink = WebSocketLink(
      url: subscriptionUri,
      config: SocketClientConfig(
        autoReconnect: true,
        inactivityTimeout: Duration(seconds: 30),
      ),
    );

    link = link.concat(websocketLink);
  }

  return ValueNotifier<GraphQLClient>(
    GraphQLClient(
      cache: cache,
      link: link,
    ),
  );
}

class ClientProvider extends StatelessWidget {
  ClientProvider({
    @required this.child,
    @required this.uri,
    this.subscriptionUri,
  });

  final Widget child;
  final String uri;
  final String subscriptionUri;

  @override
  Widget build(BuildContext context) {
    return Consumer<UserState>(
      builder: (context, userState, _) {
        ValueNotifier<GraphQLClient> client =
            clientFor(uri: uri, subscriptionUri: subscriptionUri, accessKey: userState.accessKey);

        return GraphQLProvider(
          client: client,
          child: child,
        );
      },
    );
  }
}
