export function removeQueryParam(url: string, name: string): string {
  const parts = url.split('?')
  const searchPart = parts[1]

  let search = ''
  if (searchPart) {
    const params = new URLSearchParams(parts[1])
    params.delete(name)

    const query = params.toString()
    if (query) {
      search = `?${params.toString()}`
    }
  }

  return `${parts[0]}${search}`
}
