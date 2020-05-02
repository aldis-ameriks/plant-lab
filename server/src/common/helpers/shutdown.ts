let shuttingDown = false;

export function shutdown(close: () => void) {
  process.on('unhandledRejection', async (reason) => {
    await initiateShutdown('unhandledRejection', reason, close);
  });

  process.on('uncaughtException', async (err) => {
    await initiateShutdown('uncaughtException', err, close);
  });

  (['SIGTERM', 'SIGINT'] as const).forEach((event) => {
    process.on(event, async (err) => {
      await initiateShutdown(event, err, close);
    });
  });
}

async function initiateShutdown(event, err: {} | null | undefined | Error, close: () => void) {
  console.error(err);

  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.warn(`Server shutting down`);

  const waitTime = 20 * 1000;
  setTimeout(() => {
    console.error(`Shutdown taking longer than expected, exceeding ${waitTime}ms, killing process`);
    process.exit(1);
  }, waitTime).unref();

  try {
    await close();
    console.warn('Server closed');
  } catch (e) {
    console.error('Failed to close server', e);
    process.exit(1);
  }

  process.exit(0);
}
