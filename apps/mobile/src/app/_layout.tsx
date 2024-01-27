import { useFonts } from 'expo-font'
import { ErrorBoundaryProps, Stack } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GraphqlProvider } from '../components/shared/providers/GraphqlProvider'
import { UserProvider } from '../components/shared/providers/UserProvider'
import { Text } from '../components/shared/Text'

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', gap: 24 }}>
      <Text style={{ fontSize: 20 }}>{error.message}</Text>
      <TouchableOpacity onPress={retry}>
        <Text style={{ fontSize: 16 }}>Try Again?</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function RootLayout() {
  const [isLoaded] = useFonts({
    Avenir: require('../../assets/fonts/AvenirLTStd-Book.otf')
  })

  if (!isLoaded) {
    return null
  }

  return (
    <UserProvider>
      <GraphqlProvider>
        <SafeAreaView style={{ flexGrow: 1 }}>
          <Stack screenOptions={{ contentStyle: { backgroundColor: 'white' } }} />
        </SafeAreaView>
      </GraphqlProvider>
    </UserProvider>
  )
}
