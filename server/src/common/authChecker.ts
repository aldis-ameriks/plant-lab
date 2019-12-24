import { AuthChecker } from 'type-graphql';

type User = {
  id: string;
  roles?: string[];
};

export type Context = {
  user: User;
};

export const authChecker: AuthChecker<Context> = async ({ context }, roles) => {
  const { user } = context;

  if (!user) {
    return false;
  }

  if (!roles) {
    return true;
  }
  return roles.every(role => user.roles?.includes(role));
};
