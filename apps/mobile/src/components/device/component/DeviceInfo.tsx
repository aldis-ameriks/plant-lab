import { formatDistanceToNow } from 'date-fns'
import { Image, View } from 'react-native'
import { DeviceFieldsFragment } from '../../../helpers/graphql'
import { Text } from '../../shared/Text'

const versionToImageSourceMap = {
  sensor_10: require('../../../../assets/sensor_v1.0.png'),
  hub_10: require('../../../../assets/hub_10.png')
}

type Props = {
  item: DeviceFieldsFragment
}

export const DeviceInfo = ({ item }: Props) => (
  <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
    <Image style={{ width: 40, height: 240, resizeMode: 'contain' }} source={versionToImageSourceMap[item.version]} />
    <View>
      <Text>Id: {item.id}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Room: {item.room}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Firmware: {item.firmware}</Text>
      <Text>Version: {item.version}</Text>
      <Text>Last watered: {item.lastWateredTime ? `${formatDistanceToNow(item.lastWateredTime)} ago` : '-'}</Text>
      <Text>Last reading: {item.lastReading?.time ? `${formatDistanceToNow(item.lastReading.time)} ago` : '-'}</Text>
      <Text>Battery: {item.lastReading?.batteryVoltage ? `${item.lastReading.batteryVoltage} V` : '-'}</Text>
      <Text>Temperature: {item.lastReading?.temperature ? `${item.lastReading.temperature} °C` : '-'}</Text>
      <Text>Light: {item.lastReading?.light ? `${item.lastReading.light} LUX` : '-'}</Text>
      <Text>Moisture: {item.lastReading?.moisture ? `${item.lastReading.moisture} %` : '-'}</Text>
    </View>
  </View>
)
