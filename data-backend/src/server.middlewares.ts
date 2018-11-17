import { Context } from 'koa';

export const errorHandler = async (ctx: Context, next: any) => {
  try {
    await next();
  } catch (err) {
    console.log('Error occurred', err);
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
};

export const requestLogger = async (ctx: Context, next: any) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms ${ctx.response.length}b`);
};

export const authorizationMiddleware = async (ctx: Context, next: any) => {
  const apiKey = ctx.header['api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    ctx.throw(401, 'Unauthorized');
  }
  await next();
};
