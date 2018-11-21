import * as cluster from 'cluster';

const { NODE_ENV, NODE_PORT = 8080 } = process.env;

type Server = {
  listen: (port: string | number, done: () => void) => void;
};

export const initCluster = (initializeServer: () => Server) => {
  if (NODE_ENV === 'dev') {
    const server = initializeServer();
    server.listen(NODE_PORT, () => {
      console.log('Started dev server on port %s', NODE_PORT);
    });
  } else {
    if (cluster.isMaster) {
      console.log('Server is active. Forking workers now.');
      const cpuCount = require('os').cpus().length;
      // noinspection TsLint
      for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker: cluster.Worker) => {
        console.error('Worker %s has died! Creating a new one.', worker.id);
        cluster.fork();
      });
    } else {
      const server = initializeServer();
      server.listen(NODE_PORT, () => {
        console.log('Worker %s spawned for port %s.', cluster.worker.id, NODE_PORT);
      });
    }
  }
};
