import React from 'react';
import { NavigatorIOS } from 'react-native';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import HomeScreen from './src/HomeScreen';

const client = new ApolloClient({
  uri: 'https://api.cleverhome.link/graphql'
});

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <NavigatorIOS
          initialRoute={{
            component: HomeScreen,
            title: 'Home'
          }}
          navigationBarHidden
          style={{ flex: 1 }}
        />
      </ApolloProvider>
    );
  }
}
