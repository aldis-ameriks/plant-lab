import { useRouter } from 'next/router'
import React, { HTMLAttributes, memo, useEffect } from 'react'
import { captureError } from '../helpers/captureError'

type Props = {
  errorKey: string
} & HTMLAttributes<HTMLDivElement>

export const NoData = memo(({ errorKey, ...rest }: Props) => {
  const router = useRouter()

  useEffect(() => {
    captureError(new Error(`Unexpected rendering of no data, errorKey: ${errorKey}, path: ${router?.pathname}`))
  }, [errorKey, router?.pathname])

  return <div data-testid={errorKey} {...rest} />
})
