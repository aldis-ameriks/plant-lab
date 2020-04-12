import { Context } from 'types/context';
import { ACCESS_KEY } from '../config';
import { getUserByAccessKey } from './getUserByAccessKey';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRequestContext(headers: { [key: string]: any }): Promise<Context> {
  const accessKeyHeader = headers['access-key'];
  let accessKey = Array.isArray(accessKeyHeader) ? accessKeyHeader[0] : accessKeyHeader;

  if (!accessKey && ACCESS_KEY) {
    accessKey = ACCESS_KEY;
  }

  if (!accessKey) {
    return { user: undefined };
  }

  const user = await getUserByAccessKey(accessKey);
  return { user };
}
