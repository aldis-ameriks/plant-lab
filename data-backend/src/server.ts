import { createServer, Next, plugins, Request, Response } from 'restify';
import { BadRequestError } from 'restify-errors';

import { initCluster } from './cluster';
import { getReadings, saveReading } from './sensor.service';
import { authorizationMiddleware } from './server.middlewares';

const getReadingsHandler = async (req: Request, res: Response, next: Next) => {
  try {
    const { nodeid, limit, every } = req.query;
    const readings = await getReadings(nodeid, limit, every);
    res.send(readings);
    next();
  } catch (err) {
    console.log('Failed to get readings:', err.message);
    next(err);
  }
};

const saveReadingsHandler = async (req: Request, res: Response, next: Next) => {
  try {
    const reading = {
      nodeid: req.body.nodeid,
      moisture: req.body.moisture,
      moisture_precentage: req.body.moisture_precentage,
      m_dry: req.body.m_dry,
      m_wet: req.body.m_wet,
      temperature: req.body.temperature,
      type: req.body.type,
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
      throw new BadRequestError();
    }
    await saveReading(reading);
    res.send({ message: 'success' });
    next();
  } catch (err) {
    console.log('Failed to save reading', err.message);
    next(err);
  }
};

initCluster(() => {
  const server = createServer();
  server.use(plugins.bodyParser());
  server.use(plugins.queryParser());
  server.head('/readings', getReadingsHandler);
  server.get('/readings', getReadingsHandler);
  server.post('/readings', [authorizationMiddleware, saveReadingsHandler]);
  return server;
});
