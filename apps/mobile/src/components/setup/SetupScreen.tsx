import React, { useCallback, useState } from 'react'
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native'
import { useUser } from '../shared/providers/UserProvider'
import { Text } from '../shared/Text'

export const SetupScreen = () => {
  const { setUserAccessKey } = useUser()
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(async () => {
    if (value) {
      // TODO: Validate that access key is valid
      await setUserAccessKey(value)
    }
  }, [setUserAccessKey, value])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 24 }}
    >
      <View>
        <Text style={{ fontSize: 24 }}>Enter access key</Text>
      </View>
      <View style={{ flexDirection: 'row', paddingLeft: 24, paddingRight: 24 }}>
        <TextInput
          value={value}
          onChangeText={setValue}
          style={{ padding: 8, borderBottomWidth: 1, width: 100, flexGrow: 1, fontFamily: 'Avenir' }}
        />
      </View>

      <TouchableOpacity onPress={handleSubmit} disabled={!value} style={{ opacity: value ? 1 : 0.2 }}>
        <Text style={{ fontSize: 16 }}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}
