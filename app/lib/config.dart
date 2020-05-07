import 'package:flutter_dotenv/flutter_dotenv.dart';

Map<String, dynamic> config = {
  'graphql': {
    'endpoint': 'https://api.plant.kataldi.com/graphql',
    'subscriptions': 'https://api.plant.kataldi.com/graphql'
  },
  'backend': {'endpoint': 'https://api.plant.kataldi.com'}
};

void updateConfig() {
  String graphqlEndpoint = DotEnv().env['GRAPHQL_ENDPOINT'];
  String subscriptionsEndpoint = DotEnv().env['SUBSCRIPTIONS_ENDPOINT'];
  String backendEndpoint = DotEnv().env['BACKEND_ENDPOINT'];

  if (graphqlEndpoint != null) {
    config['graphql']['endpoint'] = graphqlEndpoint;
  }

  if (subscriptionsEndpoint != null) {
    config['graphql']['subscriptions'] = subscriptionsEndpoint;
  }

  if (backendEndpoint != null) {
    config['backend']['endpoint'] = backendEndpoint;
  }
}
