const DynamoClient = require('./DynamoClient');

const { PLANTS_TABLE } = process.env;

const saveReading = async (reading) => {
  const item = { date: new Date().toISOString(), reading };
  await DynamoClient.createItem(item, PLANTS_TABLE);
};

const getReadings = (limit = 100) => DynamoClient.getItems(PLANTS_TABLE, limit);

module.exports = {
  saveReading,
  getReadings,
};
