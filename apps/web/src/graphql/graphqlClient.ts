import { retryExchange } from '@urql/exchange-retry'
import { IncomingHttpHeaders } from 'http'
import { useMemo } from 'react'
import { cacheExchange, Client, createClient, dedupExchange, errorExchange, fetchExchange, ssrExchange } from 'urql'

import { config } from '../helpers/config'
import { captureError } from '../helpers/captureError'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createGraphqlClient(graphqlEndpoint: string, initialState?: any, headers?: IncomingHttpHeaders) {
  const isServerSide = typeof window === 'undefined'

  const ssr = ssrExchange({
    isClient: !isServerSide,
    initialState
  })

  const exchanges = [
    dedupExchange,
    cacheExchange,
    ssr, // Add `ssr` in front of the `fetchExchange`
    retryExchange({
      initialDelayMs: 1000,
      maxDelayMs: 3000,
      randomDelay: true,
      maxNumberAttempts: 1,
      retryIf: (err) => !!err?.networkError
    }),
    errorExchange({
      onError: (error) => {
        console.log(error)
        if (error.graphQLErrors) {
          const isTechnicalError = error.graphQLErrors.find((entry) => entry.message.includes('Technical Error'))
          if (isTechnicalError) {
            captureError(error.graphQLErrors)
          }
        }
        if (error.networkError) {
          captureError(error.networkError)
        }
      }
    }),
    fetchExchange
  ]

  // subscriptions are not supported by msw
  // if (!isServerSide && process.env.NODE_ENV !== 'test') {
  //   try {
  //     const subscriptionClient = new SubscriptionClient(config.graphql.ws, { reconnect: true })
  //
  //     exchanges.push(
  //       subscriptionExchange({
  //         forwardSubscription(operation) {
  //           return subscriptionClient.request(operation)
  //         }
  //       })
  //     )
  //   } catch (e) {
  //     console.error('failed to establish subscription client', e)
  //   }
  // }

  if (headers) {
    // undici unsupported headers
    delete headers['connection']
    delete headers['host']
  }

  const client = createClient({
    url: graphqlEndpoint,
    fetchOptions: { headers: headers as HeadersInit },
    exchanges
  })

  return { client, ssr }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initializeGraphqlClient(
  initialState: unknown = null,
  headers?: IncomingHttpHeaders
): ReturnType<typeof createGraphqlClient> {
  const graphqlEndpoint = `${config.api.baseUrl}/graphql`
  const { client, ssr } = createGraphqlClient(graphqlEndpoint, initialState, headers)
  return { client, ssr }
}

export function useGraphqlClient(initialState: unknown): Client {
  return useMemo(() => initializeGraphqlClient(initialState).client, [initialState])
}
