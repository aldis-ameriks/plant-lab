import { createServer, Next, Request, Response } from 'restify';

import { initCluster } from './cluster';
import { getReadings, saveReading } from './sensor.service';

async function getReadingsHandler(req: Request, res: Response, next: Next) {
  try {
    const readings = await getReadings(3, 100, 5);
    res.send(readings);
    next();
  } catch (err) {
    console.log('Failed to get readings:', err.message);
    next(err);
  }
}

async function saveReadingsHandler(req: Request, res: Response, next: Next) {
  try {
    const reading = {} as any;
    const readings = await saveReading(reading);
    res.send({ message: 'success' });
    next();
  } catch (err) {
    console.log('Failed to save readings:', err.message);
    next(err);
  }
}

initCluster(() => {
  const server = createServer();
  server.get('/readings', getReadingsHandler);
  server.post('/readings', saveReadingsHandler);
  server.head('/readings', getReadingsHandler);
  return server;
});
