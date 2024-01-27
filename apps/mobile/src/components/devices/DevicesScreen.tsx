import { FlatList } from 'react-native'
import { useDevicesQuery } from '../../helpers/graphql'
import { DeviceListItem } from './components/DeviceListItem'

export const DevicesScreen = () => {
  const [{ data, error, fetching }, refetch] = useDevicesQuery()

  if (error) {
    throw error
  }

  return (
    <FlatList
      refreshing={fetching}
      onRefresh={refetch}
      data={data?.devices}
      renderItem={({ item, index }) => <DeviceListItem item={item} isLast={index + 1 === data?.devices?.length} />}
      keyExtractor={(item) => item.id}
      style={{ paddingLeft: 24, paddingRight: 24 }}
    />
  )
}
