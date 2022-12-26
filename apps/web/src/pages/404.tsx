import { useRouter } from 'next/router'

import React, { useEffect } from 'react'

const Page404: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [router])

  return null
}

export default Page404
