import * as Koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as Router from 'koa-router';

import { initCluster } from './cluster';
import { getReadings, saveReading } from './sensor.service';
import { authorizationMiddleware, errorHandler, requestLogger } from './server.middlewares';

const getReadingsHandler = async (ctx: Koa.Context, next: any) => {
  const { nodeid, limit, every } = ctx.query;
  ctx.body = await getReadings(nodeid, limit, every);
  next();
};

const saveReadingsHandler = async (ctx: Koa.Context, next: any) => {
  const { body } = ctx.request as any;
  const reading = {
    nodeid: body.nodeid,
    moisture: body.moisture,
    moisture_precentage: body.moisture_precentage,
    m_dry: body.m_dry,
    m_wet: body.m_wet,
    temperature: body.temperature,
    type: body.type,
  };
  console.log('Saving reading: ', reading);
  if (
    !reading.nodeid ||
    !reading.moisture ||
    !reading.moisture_precentage ||
    !reading.m_dry ||
    !reading.m_wet ||
    !reading.temperature
  ) {
    ctx.throw(400, 'Missing parameters');
  }
  await saveReading(reading);
  ctx.body = { message: 'success' };
  next();
};

initCluster(() => {
  const server = new Koa();
  const router = new Router();
  server.use(errorHandler);
  server.use(requestLogger);
  server.use(bodyparser());

  router.get('/readings', getReadingsHandler);
  router.post('/readings', authorizationMiddleware, saveReadingsHandler);

  server.use(router.routes()).use(router.allowedMethods());
  return server;
});
