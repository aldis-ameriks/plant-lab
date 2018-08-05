import time
import datetime
from dateutil import parser
from influxdb import InfluxDBClient
from lcd import initialize_lcd, draw_text
from pytz import timezone


def get_measurements(client, nodeid):
    query = 'SELECT * from plant where nodeid={0} ORDER BY DESC LIMIT 1'.format(nodeid)
    result_set = client.query(query)
    result = list(result_set.get_points())[0]
    moisture_percentage = result['moisture_precentage']
    temperature = result['temperature']
    light = result['light']
    time = result['time']
    nodeid = result['nodeid']
    return {
        'nodeid': nodeid,
        'moisture_percentage': '{:.0f}'.format(moisture_percentage),
        'temperature': temperature,
        'light': light,
        'time': time
    }


def draw_measurements(display, measurements):
    parsed_measurements = []
    for measurement in measurements:
        sensor_id = 'sensor id:{0}'.format(measurement['nodeid'])
        moisture_temperature = 'moist:{0} temp:{1}'.format(measurement['moisture_percentage'], measurement['temperature'])
        parsed_time = parser.parse(measurement['time'])
        minutes_since_last_reading = 'updated:{0}min'.format((datetime.datetime.now(timezone('Europe/Riga')) - parsed_time).seconds / 60)
        parsed_measurements.extend([sensor_id, moisture_temperature, minutes_since_last_reading])
    draw_text(display, parsed_measurements)


def main():
    display = initialize_lcd()
    client = InfluxDBClient('192.168.0.104', 8086, 'root', 'root', 'plants')
    while True:
        # TODO: periodically iterate over all sensors, each sensor having few seconds of screen time
        measurements = [get_measurements(client, nodeid=3)]
        print measurements
        draw_measurements(display, measurements)
        time.sleep(5)


if __name__ == '__main__':
    main()
