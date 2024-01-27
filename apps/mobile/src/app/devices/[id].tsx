import { router, Stack, useLocalSearchParams } from 'expo-router'
import { DeviceScreen } from '../../components/device/DeviceScreen'

export default function Device() {
  const local = useLocalSearchParams<{ id: string }>()

  if (!local.id) {
    router.replace('/')
    return
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: 'black',
          headerBackTitle: 'Back',
          headerBackTitleStyle: { fontFamily: 'Avenir' },
          headerTitle: ''
        }}
      />
      <DeviceScreen id={local.id} />
    </>
  )
}
