from pymongo import MongoClient
import pprint, datetime, serial, json

client = MongoClient('mongodb://192.168.0.104:27017/')
db = client.sensor_data
ser = serial.Serial('/dev/ttyACM0', 115200)

while 1:
    try:
        response = ser.readline().decode('utf-8').replace("\x00\r\n", "")
        print(str(datetime.datetime.now()) + " : response: " + response)
        parsed_response = json.loads(response);
        sensor_data_entry = parsed_response.copy();
        sensor_data_entry.date = datetime.datetime.now();
        sensor_data_id = db.sensor_data.insert_one(sensor_data_entry).inserted_id
    except Exception as e:
        print("Error: ", e)