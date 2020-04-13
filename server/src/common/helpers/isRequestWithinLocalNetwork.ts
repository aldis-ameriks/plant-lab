export function isRequestWithinLocalNetwork(ip: string, hostname: string) {
  if (hostname.startsWith(ip)) {
    return true;
  }

  const ipParts = ip.split('.').slice(0, -1).join('.');
  const hostnameParts = hostname.split('.').slice(0, -1).join('.');

  if (ipParts === hostnameParts) {
    return true;
  }

  return false;
}
