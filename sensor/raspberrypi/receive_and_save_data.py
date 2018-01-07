from pymongo import MongoClient
import pprint, datetime, serial

client = MongoClient('mongodb://192.168.0.104:27017/')
db = client.sensor_data
ser = serial.Serial('/dev/ttyACM0', 115200)

while 1:
    try:
        read_val = ser.readline()
        response = read_val.decode('utf-8').replace("\u0000\r\n", "")
        print(str(datetime.datetime.now()) + " : response: ", response)
        parsed_response = response.split(':')

        # id:type:raw_value:parsed_value:min:max
        id = parsed_response[0]
        type = parsed_response[1]
        raw_value = parsed_response[2]
        sensor_data_entry = {
            "id": id,
            "type": type,
            "raw_value": raw_value,
            "response": response,
            "date": datetime.datetime.now()
        }

        if type == 'M':
            psensor_data_entry.recentage = parsed_response[3]
            sensor_data_entry.moisture_dry = parsed_response[4]
            sensor_data_entry.moisture_wet = parsed_response[5]
        elif type == 'T':
            sensor_data_entry.temperature = raw_value
        elif type == 'L':
            sensor_data_entry.light = parsed_response[3]
            
        sensor_data_id = db.sensor_data.insert_one(sensor_data_entry).inserted_id
    except Exception as e:
        print("Error: ", e)