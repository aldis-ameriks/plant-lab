import React, { memo, PropsWithChildren } from 'react'
import { Client as UrqlClient, Provider as UrqlProvider } from 'urql'

import { useGraphqlClient } from '../graphql/graphqlClient'
import { ThemeProvider } from './theme/ThemeProvider'

type Props = PropsWithChildren<{
  initialGraphqlState?: string
  client?: UrqlClient
}>

export const Provider: React.FC<Props> = memo(({ children, initialGraphqlState, client }) => {
  const graphqlClient = useGraphqlClient(initialGraphqlState ? JSON.parse(initialGraphqlState) : undefined)
  return (
    <div data-testid="provider">
      <UrqlProvider value={client ?? graphqlClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </UrqlProvider>
    </div>
  )
})
