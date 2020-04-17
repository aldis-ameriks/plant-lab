#include <Arduino.h>
#include <sensors/moisture.h>

void MoistureSensor::init() {}

int MoistureSensor::read() {
    digitalWrite(7, HIGH);
    delay(100);
    analogRead(A1);  // Discard first reading after ADC init
    delay(20);
    int sampleCount = 10;
    int sampleSum = 0.0;

    for (int sample = 0; sample < sampleCount; sample++) {
        int capacitance = analogRead(A1);
        delay(20);
        sampleSum += capacitance;
    }

    digitalWrite(7, LOW);
    return sampleSum / (float)sampleCount;
}