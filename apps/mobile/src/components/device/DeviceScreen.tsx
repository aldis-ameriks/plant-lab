import { useMemo } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { useDeviceQuery } from '../../helpers/graphql'
import { Text } from '../shared/Text'
import { Chart } from './component/Chart'
import { DeviceInfo } from './component/DeviceInfo'

type Props = {
  id: string
}

export const DeviceScreen = ({ id }: Props) => {
  const [{ data, error, fetching }, refetch] = useDeviceQuery({ variables: { id } })

  if (error) {
    throw error
  }

  const timeEntries = useMemo(
    () => (data?.device.readings ?? []).map((reading) => reading.time).slice(-10),
    [data?.device.readings]
  )

  const temperatureEntries = useMemo(
    () => (data?.device.readings ?? []).map((reading) => reading.temperature).slice(-10),
    [data?.device.readings]
  )

  const moistureEntries = useMemo(
    () => (data?.device.readings ?? []).map((reading) => reading.moisture).slice(-10),
    [data?.device.readings]
  )

  const batteryVoltageEntries = useMemo(
    () => (data?.device.readings ?? []).map((reading) => reading.batteryVoltage).slice(-10),
    [data?.device.readings]
  )

  if (fetching || !data) {
    return null
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={fetching} onRefresh={refetch} />}>
      <View style={{ padding: 24 }}>
        <DeviceInfo item={data.device} />
      </View>
      <View style={{ gap: 16 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text>Temperature</Text>
          <Chart labels={timeEntries} data={temperatureEntries} yAxisSuffix="°C" />
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text>Moisture</Text>
          <Chart labels={timeEntries} data={moistureEntries} yAxisSuffix="%" />
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text>Battery Voltage</Text>
          <Chart labels={timeEntries} data={batteryVoltageEntries} yAxisSuffix="V" />
        </View>
      </View>
    </ScrollView>
  )
}
