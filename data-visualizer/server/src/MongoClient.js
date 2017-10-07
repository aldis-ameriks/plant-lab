const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

app.get('/sensor/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const count =  parseInt(req.query.count);
    connectAndQueryData(count, result => {
      res.send(JSON.stringify(result));
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3001, () => {
  console.log('Sensor data mongo client listening on 3001');
});

const connectAndQueryData = (count, callback)=> {
  const url = 'mongodb://192.168.0.104:27017/sensor_data';
  MongoClient.connect(url, (err, database) => {
    querySensorData(database, count, result => {
      database.close();
      callback(result);
    });
  });
};

const querySensorData = (database, count, callback) => {
  database
    .collection('sensor_data')
    .find()
    .sort({ date: -1 })
    .limit(count)
    .toArray()
    .then(result => result.reverse())
    .then(callback);
};
