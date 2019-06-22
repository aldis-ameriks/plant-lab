from influxdb import InfluxDBClient
import datetime, serial, time

client = InfluxDBClient('192.168.0.107', 8086, 'sensor', 'Ipas1DrosaParolePubDb!23', 'plants')
ser = serial.Serial('/dev/ttyACM1', 115200)

while 1:
    try:
        raw_response = ser.readline().decode('utf-8').replace("\x00\r\n", "")
        print(str(datetime.datetime.now()) + " : raw_response: " + raw_response)
        [
            node_id,
            moisture,
            moisture_percentage,
            moisture_dry,
            moisture_wet,
            temperature,
            light,
            battery_voltage
        ] = raw_response.split(";")
        current_time = datetime.datetime.now()
        data = [{
            "measurement": "plant",
            "tags": {
                "node_id": node_id,
            },
            "time": current_time,
            "fields": {
                "moisture": int(moisture),
                "moisture_percentage": float(moisture_percentage),
                "moisture_dry": int(moisture_dry),
                "moisture_wet": int(moisture_wet),
                "temperature": int(temperature),
                "battery_voltage": float(battery_voltage),
                "light": light
            }
        }]
        client.write_points(data)
        time.sleep(2)
    except Exception as e:
        print("Error: ", e)
