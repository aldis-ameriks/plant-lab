import { retryExchange } from '@urql/exchange-retry'
import { cacheExchange, createClient, errorExchange, fetchExchange } from 'urql'
import { config } from './config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createGraphqlClient(graphqlEndpoint: string) {
  const exchanges = [
    cacheExchange,
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
          const isTechnicalError = error.graphQLErrors.some((entry) => entry.message.includes('Technical Error'))
          if (isTechnicalError) {
            // captureError(error.graphQLErrors)
          }
        }
        if (error.networkError) {
          // captureError(error.networkError)
        }
      }
    }),
    fetchExchange
  ]

  const client = createClient({
    url: graphqlEndpoint,
    exchanges
  })

  return { client }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initializeGraphqlClient(): ReturnType<typeof createGraphqlClient> {
  const graphqlEndpoint = `${config.api.baseUrl}/graphql`
  const { client } = createGraphqlClient(graphqlEndpoint)
  return { client }
}
