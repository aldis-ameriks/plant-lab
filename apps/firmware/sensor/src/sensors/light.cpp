#include <Arduino.h>
#include <Wire.h>
#include <BH1750.h>
#include <sensors/light.h>

BH1750 lightMeter;

void LightSensor::init() {
    lightMeter.begin(BH1750::ONE_TIME_HIGH_RES_MODE);
};

uint32_t LightSensor::read() {
    while (!lightMeter.measurementReady(true)) {
        // wait until measurement is ready
    }
    
    float lux = lightMeter.readLightLevel();
    lightMeter.configure(BH1750::ONE_TIME_HIGH_RES_MODE);
    return (uint32_t)lux;
}