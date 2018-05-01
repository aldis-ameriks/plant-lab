import time
from influxdb import InfluxDBClient
from lcd import initialize_lcd, draw_text


def get_measurements(client, nodeid):
    query = 'SELECT last(*) from plant where nodeid={0}'.format(nodeid)
    result_set = client.query(query)
    moisture_percentage = list(result_set.get_points())[0]['last_moisture_precentage']
    temperature = list(result_set.get_points())[0]['last_temperature']
    light = list(result_set.get_points())[0]['last_light']
    return {'moisture_percentage': '{:.0f}'.format(moisture_percentage), 'temperature': temperature, 'light': light}


def draw_measurements(display, measurements):
    parsed_measurements = []
    for measurement in measurements:
        moisture_temperature = 'moist:{0} temp:{1}'.format(measurement['moisture_percentage'], measurement['temperature'])
        light = 'light:{0}'.format(measurement['light'])
        parsed_measurements.extend([moisture_temperature, light])
    draw_text(display, parsed_measurements)


def main():
    display = initialize_lcd()
    client = InfluxDBClient('192.168.0.104', 8086, 'root', 'root', 'plants')
    while True:
        measurements = [get_measurements(client, nodeid=2), get_measurements(client, nodeid=3)]
        print measurements
        draw_measurements(display, measurements)
        time.sleep(5)


if __name__ == '__main__':
    main()
