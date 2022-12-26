import { AppProps } from 'next/app'
import React from 'react'

import { BuildVersion } from '../components/BuildVersion'
import { Provider } from '../components/Provider'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const ComponentToRender = Component

  return (
    <Provider initialGraphqlState={pageProps.initialGraphqlState}>
      <BuildVersion />
      <ComponentToRender {...pageProps} />
    </Provider>
  )
}

export default MyApp
