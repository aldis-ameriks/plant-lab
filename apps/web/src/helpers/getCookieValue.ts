export function getCookieValue(name: string): string {
  const result = document.cookie.match(`(^|[^;]+)\\s*${name}\\s*=\\s*([^;]+)`)
  return result?.pop() ?? ''
}
