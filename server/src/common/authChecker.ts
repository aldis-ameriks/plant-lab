import { AuthChecker } from 'type-graphql';
import { getUserByAccessKey } from './helpers/getUserByAccessKey';

type Context = {
  accessKey: string;
};

export const authChecker: AuthChecker<Context> = async ({ context }, roles) => {
  const { accessKey } = context;
  if (!accessKey) {
    return false;
  }

  const user = await getUserByAccessKey(accessKey);

  if (!user) {
    return false;
  }

  if (!roles) {
    return true;
  }
  return roles.every(role => user?.roles?.includes(role));
};
