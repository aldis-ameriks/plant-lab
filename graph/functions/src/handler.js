const PlantService = require('./PlantService');

const handleTeapot = (event, context, callback) => {
  console.log(JSON.stringify(event));
  const response = { statusCode: 418, body: JSON.stringify({ message: 'I\'m a teapot' }) };
  return callback(null, response);
};

const handlePostReading = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  const parsedBody = JSON.parse(event.body);
  await PlantService.saveReading(parsedBody);
  callback(null, { statusCode: 200, body: JSON.stringify({ message: 'success' }) });
};

const handleGetReadings = async (event, context, callback) => {
  console.log(JSON.stringify(event));
  const { limit } = event.queryStringParameters;
  const result = await PlantService.getReadings(limit);
  callback(null, { statusCode: 200, body: JSON.stringify(result) });
};

module.exports = {
  handleTeapot,
  handlePostReading,
  handleGetReadings,
};
