#include <Arduino.h>
#include <Wire.h>
#include <sensors/light.h>

void LightSensor::init() {
    Wire.beginTransmission(0x44);
    Wire.write(0x01);
    Wire.write(0xCA);  // 800ms, single shot
    Wire.write(0x10);
    Wire.endTransmission();
};

int LightSensor::read() {
    Wire.beginTransmission(0x44);
    Wire.write(0x00);
    Wire.endTransmission();

    uint8_t buf[2];
    Wire.requestFrom(0x44, 2);

    int counter = 0;
    while (Wire.available() < 2) {
        counter++;
        delay(10);
        if (counter > 100) {
            return -1;
        }
    }

    Wire.readBytes(buf, 2);
    uint16_t data = (buf[0] << 8) | buf[1];
    uint16_t fraction = data & 0x0FFF;
    uint16_t exponent = (data & 0xF000) >> 12;
    return fraction * (0.01 * pow(2, exponent));
}