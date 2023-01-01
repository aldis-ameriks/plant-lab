import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Device } from '../../components/device/Device'
import { DeviceDocument } from '../../helpers/graphql'
import { initializeGraphqlClient } from '../../helpers/graphqlClient'

const DevicePage = () => {
  const { query } = useRouter()

  let { id = '' } = query
  if (Array.isArray(id)) {
    id = id[0]
  }

  return <Device id={id} />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
): Promise<GetServerSidePropsResult<{ initialGraphqlState: string }>> {
  const { client, ssr } = initializeGraphqlClient(null, context.req.headers)
  const promises: Promise<unknown>[] = [client.query(DeviceDocument, { id: context.params?.id }).toPromise()]

  await Promise.all(promises)

  return {
    props: {
      initialGraphqlState: JSON.stringify(ssr.extractData())
    }
  }
}

export default DevicePage
