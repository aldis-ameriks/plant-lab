import { AuthChecker } from 'type-graphql';

import { Context } from 'common/types/context';

export const authChecker: AuthChecker<Context> = async ({ context }, roles) => {
  const { user } = context;

  if (!user) {
    return false;
  }

  if (!roles) {
    return true;
  }
  return roles.every((role) => user.roles.includes(role));
};
