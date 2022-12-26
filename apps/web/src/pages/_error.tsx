import { NextPageContext } from 'next'
import NextError, { ErrorProps } from 'next/error'
import React, { ReactElement } from 'react'
import { captureError } from '../helpers/captureError'

const CustomError = ({ statusCode, err }: ErrorProps & { err?: Error }): ReactElement => {
  if (err) {
    captureError(err)
  }
  return <NextError statusCode={statusCode} />
}

CustomError.getInitialProps = async (context: NextPageContext) => {
  const errorInitialProps = await NextError.getInitialProps(context)
  const { res, err } = context

  if (res?.statusCode === 404) {
    return { statusCode: 404 }
  }

  if (err) {
    console.error(err)
    captureError(err)
    return errorInitialProps
  }

  return errorInitialProps
}

export default CustomError
