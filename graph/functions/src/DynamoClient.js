const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

const getItemByKey = async (key, value, table) => {
  console.log(`Getting item by key: ${key} and value: ${value} in table: ${table}`);
  const params = {
    TableName: table,
    IndexName: key,
    KeyConditionExpression: `${key} = :value`,
    ExpressionAttributeValues: {
      ':value': value,
    },
  };
  const result = await dynamoDb.query(params).promise();
  if (result.Count === 1) {
    return result.Items[0];
  }
  if (result.Count > 1) {
    return result.Items;
  }
  return null;
};

const getItems = (table, limit) => {
  console.log('Getting items');
  return dynamoDb.scan({ TableName: table, Limit: limit }).promise();
};

const createItem = (item, table) => {
  console.log(`Creating item: ${item} in table: ${table}`);
  return dynamoDb.put({ TableName: table, Item: { ...item } }).promise();
};

module.exports = {
  getItems,
  getItemByKey,
  createItem,
};
