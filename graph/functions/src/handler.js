const SensorService = require('./SensorService');

const handlePostReading = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  const parsedBody = JSON.parse(event.body);
  await SensorService.saveReading(parsedBody);
  callback(null, { statusCode: 200, body: JSON.stringify({ message: 'success' }) });
};

const handleGetReadings = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  const { nodeid, limit } = event.queryStringParameters;
  const result = await SensorService.getReadings(nodeid, limit);
  callback(null, { statusCode: 200, body: JSON.stringify(result) });
};

module.exports = {
  handlePostReading,
  handleGetReadings,
};
