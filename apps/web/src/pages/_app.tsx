import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

import { BuildVersion } from '../components/BuildVersion'
import { Provider } from '../components/Provider'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const ComponentToRender = Component

  return (
    <>
      <Head>
        <title>Plants</title>
      </Head>
      <Provider initialGraphqlState={pageProps.initialGraphqlState}>
        <BuildVersion />
        <ComponentToRender {...pageProps} />
      </Provider>
    </>
  )
}

export default MyApp
