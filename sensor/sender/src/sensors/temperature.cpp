#include <Adafruit_SHT31.h>
#include <sensors/temperature.h>

Adafruit_SHT31 sht1 = Adafruit_SHT31();

void TemperatureSensor::init() {
    if (!sht1.begin(0x44)) {
        Serial.println("Couldn't find SHT3x");
    }
}

float TemperatureSensor::readTemperature() {
    return sht1.readTemperature();
}

float TemperatureSensor::readHumidity() {
    return sht1.readHumidity();
}
