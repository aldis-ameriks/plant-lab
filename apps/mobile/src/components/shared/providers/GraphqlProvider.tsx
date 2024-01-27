import React, { PropsWithChildren, useMemo } from 'react'
import { Provider } from 'urql'
import { initializeGraphqlClient } from '../../../helpers/graphqlClient'
import { useUser } from './UserProvider'

export const GraphqlProvider = ({ children }: PropsWithChildren) => {
  const user = useUser()
  const graphqlClient = useMemo(() => initializeGraphqlClient().client, [user.userAccessKey])

  return <Provider value={graphqlClient}>{children}</Provider>
}
