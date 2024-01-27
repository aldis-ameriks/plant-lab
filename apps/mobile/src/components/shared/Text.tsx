import { ComponentProps, useMemo } from 'react'
import { Text as TextNative } from 'react-native'

type Props = ComponentProps<typeof TextNative>

export const Text = (props: Props) => {
  const style = useMemo(() => {
    if (props.style) {
      return [props.style, { fontFamily: 'Avenir' }]
    }
    return { fontFamily: 'Avenir' }
  }, [props.style])

  return <TextNative {...props} style={style} />
}
