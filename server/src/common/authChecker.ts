import { AuthChecker } from 'type-graphql';

type Context = {
  isAuthorized: boolean;
};

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  return context.isAuthorized;
};
