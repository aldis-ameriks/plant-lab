import os from 'os';

export function getServerIp() {
  const interfaces = os.networkInterfaces();

  let address;
  Object.values(interfaces).forEach((value) => {
    value.forEach((entry) => {
      if (entry.family === 'IPv6') {
        address = entry.address;
      }
    });
  });

  return address;
}
