import { DevicesScreen } from './devices/DevicesScreen'
import { SetupScreen } from './setup/SetupScreen'
import { useUser } from './shared/providers/UserProvider'

export const HomeScreen = () => {
  const user = useUser()

  if (!user.userAccessKey) {
    return <SetupScreen />
  }

  return <DevicesScreen />
}
