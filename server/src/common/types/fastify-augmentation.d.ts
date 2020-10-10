import { RouteGenericInterface } from 'fastify/types/route';
import { RawRequestDefaultExpression, RawServerBase, RawServerDefault } from 'fastify/types/utils';

import { Context } from 'common/types/context';

declare module 'fastify' {
  interface FastifyRequest<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>
  > {
    ctx: Context;
  }
}
