#include <RFM69.h>
#include <RFM69_ATC.h>
#include <I2CSoilMoistureSensor.h>
#include <LowPower.h>
#include <Wire.h>
#include <avr/sleep.h>
#include "secrets.h"

#define SERIAL_BAUD 115200

#define NODEID      2
#define NETWORKID   100
#define GATEWAYID   1
#define FREQUENCY     RF69_433MHZ
#define ENCRYPTKEY    RADIO_ENCRYPTION_KEY
//#define IS_RFM69HW_HCW  //uncomment only for RFM69HW/HCW! Leave out if you have RFM69W/CW!
#define REQUEST_ACK true
#define ACK_TIME 50
#define DELAY_BEFORE_SLEEP (long)1000
//*********************************************************************************************
//Auto Transmission Control - dials down transmit power to save battery
//Usually you do not need to always transmit at max output power
//By reducing TX power even a little you save a significant amount of battery power
//This setting enables this gateway to work with remote nodes that have ATC enabled to
//dial their power down to only the required level
#define ENABLE_ATC    //comment out this line to disable AUTO TRANSMISSION CONTROL
//*********************************************************************************************

#ifdef ENABLE_ATC
  RFM69_ATC radio;
#else
  RFM69 radio;
#endif

int MOISTURE_DRY = 244;
int MOISTURE_WET = 510;
I2CSoilMoistureSensor sensor;

// For measuring battery voltage
float R1 = 1000000.0; // R1 (1M)
float R2 = 270000.0;  // R2 (270K)
float INTERNAL_AREF = 1.1;

void setup() {
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  radio.initialize(FREQUENCY, NODEID, NETWORKID);

  #ifdef IS_RFM69HW_HCW
    radio.setHighPower(); //must include this only for RFM69HW/HCW!
  #endif

  radio.encrypt(ENCRYPTKEY);
  radio.sleep();
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

  pinMode(6, OUTPUT);
}

void loop() {
  while (sensor.isBusy()) {
    Serial.println("Sensor is busy");
    digitalWrite(6, HIGH);
    delay(50);
  }

  digitalWrite(6, LOW);

  Serial.println("Reading sensor values");
  int moisture = sensor.getCapacitance();
  float moisturePercentage = (1 - (MOISTURE_WET - moisture) / (MOISTURE_WET - (float)MOISTURE_DRY)) *100;
  int temperature = sensor.getTemperature() / (float)10;
//   unsigned int light = sensor.getLight(true);
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

  radio.send(GATEWAYID, payload_array, payload_len, REQUEST_ACK);
  if (REQUEST_ACK) {
    if (waitForAck()) {
      Serial.print("ACK RECEIVED");
      digitalWrite(6, HIGH);
      delay(1000);
      digitalWrite(6, LOW);
    } else {
      digitalWrite(6, HIGH);
      delay(200);
      digitalWrite(6, LOW);
      delay(200);
      digitalWrite(6, HIGH);
      delay(200);
      digitalWrite(6, LOW);
      delay(200);
      digitalWrite(6, HIGH);
      delay(200);
      digitalWrite(6, LOW);
      Serial.print("ACK NOT RECEIVED");
    }
  }
  radio.sleep();
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
  float batteryVoltage = (rawReading/(float)1023) * INTERNAL_AREF * ((R1+R2)/R2);
  return batteryVoltage;
}
