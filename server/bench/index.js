import autocannon from 'autocannon';
import dotenv from 'dotenv';

dotenv.config();

function startBench() {
  const url = 'https://api.plant.kataldi.com';

  const instance = autocannon(
    {
      url,
      connections: 50,
      duration: 60,
      headers: {
        'access-key': process.env.ACCESS_KEY,
        'Content-Type': 'application/json',
      },
      requests: [
        {
          method: 'POST',
          path: '/graphql',
          body: JSON.stringify({
            query: `
              query ($deviceId: ID!, $date: String!) {
                lastReading(deviceId: $deviceId) {
                  device_id
                  time
                  moisture
                  temperature
                  battery_voltage
                  light
                }
                lastWateredTime(deviceId: $deviceId)
                readings(deviceId: $deviceId, date: $date) {
                  device_id
                  time
                  moisture
                  temperature
                  battery_voltage
                  light
                }
              }
          `,
            variables: {
              deviceId: '7',
              date: '2019-02-27T15:06:54.631Z',
            },
          }),
          onResponse: (status, body, _context) => {
            if (status !== 200) {
              console.error(body);
            }
          },
        },
      ],
    },
    finishedBench
  );

  process.once('SIGINT', () => {
    instance.stop();
  });

  function finishedBench(err, res) {
    console.log('finished bench', err, res);
  }
}

startBench();
