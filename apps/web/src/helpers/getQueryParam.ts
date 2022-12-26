import { ParsedUrlQuery } from 'querystring'

export function getQueryParam(queryParams: ParsedUrlQuery, name: string): string | undefined {
  if (!queryParams) {
    return undefined
  }

  const value = queryParams[name]

  if (!value) {
    return undefined
  }

  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}
