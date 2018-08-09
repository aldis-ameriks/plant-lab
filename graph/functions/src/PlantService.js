const uuid = require('uuid');
const DynamoClient = require('./DynamoClient');

const { PLANTS_TABLE } = process.env;

const saveReading = async (reading) => {
  const item = { readingId: uuid(), date: new Date().toISOString(), reading };
  await DynamoClient.createItem(item, PLANTS_TABLE);
};

module.exports = {
  saveReading,
};
