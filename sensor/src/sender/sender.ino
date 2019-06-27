#include <I2CSoilMoistureSensor.h>
#include <LowPower.h>
#include <RFM12B.h>
#include <Wire.h>
#include <avr/sleep.h>
#include "secrets.h"

// You will need to initialize the radio by telling it what ID it has and what
// network it's on The NodeID takes values from 1-127, 0 is reserved for sending
// broadcast messages (send to all nodes) The Network ID takes values from 0-255
// By default the SPI-SS line used is D10 on Atmega328. You can change it by
// calling .SetCS(pin) where pin can be {8,9,10}
#define NODEID 4     // network ID used for this unit
#define NETWORKID 99 // the network ID we are on
#define GATEWAYID 1  // the node ID we're sending to
#define SERIAL_BAUD 115200
#define REQUEST_ACK true
#define ACK_TIME 50
#define DELAY_BEFORE_SLEEP (long)1000

uint8_t KEY[] = RADIO_ENCRYPTION_KEY;
RFM12B radio;

int MOISTURE_DRY = 355;
int MOISTURE_WET = 650;
I2CSoilMoistureSensor sensor;

float BATTERY_MEASUREMENT_RESISTOR_RATIO = 8.81;
float INTERNAL_AREF = 1.1;

void setup() {
  Serial.begin(SERIAL_BAUD);
  delay(1000);    // give some time for serial to init

  // Init RFM12B in transmit mode
  Serial.println("Initializing Radio module");
  radio.Initialize(NODEID, RF12_433MHZ, NETWORKID);
  radio.Encrypt(KEY);
  radio.Sleep();
  Serial.println("Radio module initialized");

  // Init sensor
  Serial.println("Initializing sensor");
  delay(2000);    // give some time to boot up
  Wire.begin();
  sensor.begin(); // reset sensor
  delay(1000);    // give some time to boot up
  Serial.print("I2C Soil Moisture Sensor Address: ");
  Serial.println(sensor.getAddress(), HEX);
  Serial.print("Sensor Firmware version: ");
  Serial.println(sensor.getVersion(), HEX);
  Serial.println("Sensor initialized");

  // Init analog ref to internal voltage (1.1v)
  analogReference(INTERNAL);

}

void loop() {
  while (sensor.isBusy()) {
    Serial.println("Sensor is busy");
    delay(500);
  }

  Serial.println("Reading sensor values");
  int moisture = sensor.getCapacitance();
  float moisturePercentage = (1 - (MOISTURE_WET - moisture) / (MOISTURE_WET - (float)MOISTURE_DRY)) *100;
  int temperature = sensor.getTemperature() / (float)10;
  // unsigned int light = sensor.getLight(true);
  unsigned int light = 0; // light sensor is covered on the rugged version of sensor
  Serial.println("Putting sensor to sleep");
  sensor.sleep();
  Serial.println("Sensor sleeping");
  float batteryVoltage = readBatteryVoltage();

  String payload = "";
  payload += NODEID;
  payload += ";";
  payload += moisture;
  payload += ";";
  payload += (String)moisturePercentage;
  payload += ";";
  payload += MOISTURE_DRY;
  payload += ";";
  payload += MOISTURE_WET;
  payload += ";";
  payload += temperature;
  payload += ";";
  payload += light;
  payload += ";";
  payload += (String)batteryVoltage;
  Serial.println(payload);

  sendData(payload);
  enterSleep();
}

void sendData(String payload) {
  Serial.print("Sending[" + payload + "] ");
  int payload_len = payload.length() + 1;
  char payload_array[payload_len];
  payload.toCharArray(payload_array, payload_len);

  radio.Wakeup();
  radio.Send(GATEWAYID, payload_array, payload_len, REQUEST_ACK);
  if (REQUEST_ACK) {
    if (waitForAck()) {
      Serial.print("ACK RECEIVED");
    } else {
      Serial.print("ACK NOT RECEIVED");
    }
  }
  radio.Sleep();
  Serial.print(" Done\n");
}

static bool waitForAck() {
  long now = millis();
  while (millis() - now <= ACK_TIME)
    if (radio.ACKReceived(GATEWAYID))
      return true;
  return false;
}

void enterSleep() {
  delay(DELAY_BEFORE_SLEEP); // delay to avoid cutting off serial output

  // 30 minutes = 60x30 = 1800s
  // 1800 s / 8 s = 225
  unsigned int sleepCounter;
  for (sleepCounter = 225; sleepCounter > 0; sleepCounter--) {
    LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF);
  }
}

float readBatteryVoltage() {
  analogRead(0);
  delay(50);
  int rawReading = analogRead(0);
  float batteryVoltage = (rawReading/(float)1023) * INTERNAL_AREF * BATTERY_MEASUREMENT_RESISTOR_RATIO;
  return batteryVoltage;
}
