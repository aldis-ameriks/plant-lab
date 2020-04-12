import { DefaultBody, DefaultHeaders, DefaultParams, DefaultQuery } from 'fastify';
import * as http from 'http';
import { Context } from 'types/context';

declare module 'fastify' {
  interface FastifyRequest<
    HttpRequest = http.IncomingMessage,
    Query = DefaultQuery,
    Params = DefaultParams,
    Headers = DefaultHeaders,
    Body = DefaultBody
  > {
    context: Context;
  }
}
