import { router } from 'expo-router'
import { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { DevicesQuery } from '../../../helpers/graphql'
import { DeviceInfo } from '../../device/component/DeviceInfo'
import { Text } from '../../shared/Text'

type Props = {
  item: DevicesQuery['devices'][number]
  isLast: boolean
}

export const DeviceListItem = ({ item, isLast }: Props) => {
  const handlePress = useCallback(() => {
    router.push(`/devices/${item.id}`)
  }, [item.id])

  return (
    <View
      style={{
        padding: 24,
        borderBottomWidth: isLast ? 0 : 1
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <DeviceInfo item={item} />
        <Text style={{ fontSize: 24 }}>›</Text>
      </TouchableOpacity>
    </View>
  )
}
