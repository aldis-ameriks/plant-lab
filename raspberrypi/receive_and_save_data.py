from influxdb import InfluxDBClient
import datetime, serial, json

client = InfluxDBClient('192.168.0.104', 8086, 'root', 'root', 'plants')
ser = serial.Serial('/dev/ttyACM0', 115200)

while 1:
    try:
        response = ser.readline().decode('utf-8').replace("\x00\r\n", "")
        print(str(datetime.datetime.now()) + " : response: " + response)
        parsed_response = json.loads(response)
        data = [{
            "measurement": "plant",
            "tags": {
                "nodeid": parsed_response["nodeid"]
            },
            "time": datetime.datetime.now(),
            "fields": {
                "moisture": parsed_response["moisture"],
                "moisture_precentage": float(parsed_response["moisture_precentage"]),
                "m_dry": parsed_response["m_dry"],
                "m_wet": parsed_response["m_wet"],
                "temperature": parsed_response["temperature"],
                "light": parsed_response["light"]
            }
        }]
        client.write_points(data)
    except Exception as e:
        print("Error: ", e)
