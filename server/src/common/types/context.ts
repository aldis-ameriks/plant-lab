import { Logger } from 'pino';

type User = {
  id: string;
  roles: string[];
};

export type Context = {
  user: User;
  ip: string;
  isLocal: boolean;
  log: Logger;
};
