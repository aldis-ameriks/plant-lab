#include <Arduino.h>
#include <Wire.h>
#include <BH1750.h>
#include <sensors/light.h>

BH1750 lightMeter;

void LightSensor::init() {
    lightMeter.begin(BH1750::ONE_TIME_HIGH_RES_MODE);
};

uint32_t LightSensor::read() {
    float lux = lightMeter.readLightLevel();
    return (uint32_t)lux;
}