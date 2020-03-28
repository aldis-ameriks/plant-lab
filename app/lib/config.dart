import 'package:flutter_dotenv/flutter_dotenv.dart';

Map<String, dynamic> config = {
  'graphql': {'endpoint': 'http://localhost:4000/graphql', 'subscriptions': 'http://localhost:4000/graphql'}
};

void updateConfig() {
  String graphqlEndpoint = DotEnv().env['GRAPHQL_ENDPOINT'];
  String subscriptionsEndpoint = DotEnv().env['SUBSCRIPTIONS_ENDPOINT'];

  if (graphqlEndpoint != null) {
    config['graphql']['endpoint'] = graphqlEndpoint;
  }

  if (subscriptionsEndpoint != null) {
    config['graphql']['subscriptions'] = subscriptionsEndpoint;
  }
}
