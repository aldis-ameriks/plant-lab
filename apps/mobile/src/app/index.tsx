import { Stack } from 'expo-router'
import { HomeScreen } from '../components/HomeScreen'

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </>
  )
}
