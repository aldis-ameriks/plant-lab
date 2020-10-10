import { IncomingHttpHeaders } from 'http';

import { Logger } from 'pino';

import { ACCESS_KEY } from 'common/config';
import { getUserByAccessKey } from 'common/helpers/getUserByAccessKey';
import { isRequestWithinLocalNetwork } from 'common/helpers/isRequestWithinLocalNetwork';
import { Context } from 'common/types/context';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRequestContext(
  log: Logger,
  headers: IncomingHttpHeaders,
  ip: string,
  hostname: string
): Promise<Context> {
  const accessKeyHeader = headers['access-key'];
  let accessKey = Array.isArray(accessKeyHeader) ? accessKeyHeader[0] : accessKeyHeader;
  if (!accessKey && ACCESS_KEY) {
    accessKey = ACCESS_KEY;
  }

  const isLocal = isRequestWithinLocalNetwork(ip, hostname);

  if (!accessKey) {
    return { user: undefined, ip, isLocal, log };
  }

  const user = await getUserByAccessKey(accessKey);
  return { user, ip, isLocal, log };
}
