import { Next, Request, Response } from 'restify';
import { UnauthorizedError } from 'restify-errors';

export const authorizationMiddleware = (req: Request, res: Response, next: Next) => {
  const apiKey = req.header('api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    next(new UnauthorizedError());
  }
  next();
};
