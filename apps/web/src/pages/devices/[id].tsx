import { useRouter } from 'next/router'
import React from 'react'
import { Device } from '../../components/device/device'

const DevicePage = () => {
  const { query } = useRouter()

  let { id = '' } = query
  if (Array.isArray(id)) {
    id = id[0]
  }

  return <Device id={id} />
}

export default DevicePage
