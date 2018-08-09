const DynamoClient = require('./DynamoClient');

const { SENSORS_TABLE } = process.env;

const saveReading = async (reading) => {
  const item = { ...reading, sensor_date: new Date().toISOString() };
  await DynamoClient.createItem(item, SENSORS_TABLE);
};

const getReadings = (type = 'moisture', limit = 100) => DynamoClient.getItemByKey('sensor_type', type, limit, SENSORS_TABLE);

module.exports = {
  saveReading,
  getReadings,
};
