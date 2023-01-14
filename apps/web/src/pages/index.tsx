import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React from 'react'
import { Devices } from '../components/devices/Devices'
import { DevicesDocument } from '../helpers/graphql'
import { initializeGraphqlClient } from '../helpers/graphqlClient'

const Index = () => {
  return <Devices />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ initialGraphqlState: string }>> {
  const { client, ssr } = initializeGraphqlClient(null, context.req.headers)

  const promises: Promise<unknown>[] = [client.query(DevicesDocument, {}).toPromise()]

  await Promise.all(promises)

  return {
    props: {
      initialGraphqlState: JSON.stringify(ssr.extractData())
    }
  }
}

export default Index
