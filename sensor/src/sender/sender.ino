#include <RFM69.h>
#include <RFM69_ATC.h>
#include <LowPower.h>
#include <Wire.h>
#include <avr/sleep.h>
#include "secrets.h"

#define SERIAL_BAUD 115200

#define NODEID      1
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

#define WITH_REGULATOR

// Calibrated values
int MOISTURE_MIN = 240;
int MOISTURE_MAX = 515;

// For measuring battery voltage
float R1 = 10000000.0; // R1 (10M)
float R2 = 1000000.0;  // R2 (1M)
float INTERNAL_AREF = 1.1;

void setup() {
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {
    ; // Wait for serial port to connect
  }
  radio.initialize(FREQUENCY, NODEID, NETWORKID);

  #ifdef IS_RFM69HW_HCW
    radio.setHighPower(); // Must include this only for RFM69HW/HCW!
  #endif

  radio.encrypt(ENCRYPTKEY);
  radio.sleep();
  Serial.println("Radio module initialized");

  // Init light sensor
  Serial.println("Initializing light sensor");
  initializeLightSensor();

  // pinMode(13, OUTPUT); // SCK pin LED, flashes when interfacing with RFM69
  pinMode(6, OUTPUT);
  pinMode(5, OUTPUT);

  pinMode(7, OUTPUT); // Powers capacitance sensor
  pinMode(8, OUTPUT); // Powers temperature sensor
}

void loop() {
  float batteryVoltage = readBatteryVoltage();
  float operatingVoltage = batteryVoltage;
  #ifdef WITH_REGULATOR
    operatingVoltage = batteryVoltage > 3.31 ? 3.31 : batteryVoltage;
  #endif

  int moisture = readMoisture();
  float moisturePercentage = (1 - (MOISTURE_MAX - moisture) / (MOISTURE_MAX - (float)MOISTURE_MIN)) * 100;

  float temperature = readTemperature(operatingVoltage);
  int light = readLight();

  String payload = "";
  payload += NODEID;
  payload += ";";
  payload += moisture;
  payload += ";";
  payload += (String)moisturePercentage;
  payload += ";";
  payload += MOISTURE_MIN;
  payload += ";";
  payload += MOISTURE_MAX;
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
      delay(500);
      digitalWrite(6, LOW);
    } else {
      digitalWrite(5, HIGH);
      delay(500);
      digitalWrite(5, LOW);
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
  for (sleepCounter = 1; sleepCounter > 0; sleepCounter--) {
    LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF);
  }
}

float readBatteryVoltage() {
  analogReference(INTERNAL);
  delay(100);
  analogRead(0); // Discard first reading after ADC init
  delay(50);
  int rawReading = analogRead(0);
  float batteryVoltage = ((rawReading + 0.5) / (float)1024) * INTERNAL_AREF * ((R1 + R2) / R2);
  analogReference(DEFAULT);
  delay(100);
  return batteryVoltage;
}

int readMoisture() {
  digitalWrite(7, HIGH);
  delay(100);
  analogRead(A1); // Discard first reading after ADC init
  delay(50);
  int sampleCount = 10;
  int sampleSum = 0.0;

  for (int sample = 0; sample < sampleCount; sample++) {
    int capacitance = analogRead(A1);
    delay(20);
    sampleSum += capacitance;
  }

  digitalWrite(7, LOW);
  return sampleSum / (float) sampleCount;
}

float readTemperature(float operatingVoltage) {
  digitalWrite(8, HIGH);
  delay(100);
  analogRead(A2); // Discard first reading after ADC init
  delay(50);
  float voltageOffset = 0.5; // Voltage offset at 0 degrees
  float temperatureCoefficient = 0.01; // Temperature coefficient
  int sampleCount = 1;
  float sampleSum = 0.0;
  float temperature;

  for (int sample = 0; sample < sampleCount; sample++) {
    temperature = ((float)analogRead(A2) * operatingVoltage / 1023.0);
    temperature = (temperature - voltageOffset) / temperatureCoefficient;
    delay(20);
    sampleSum += temperature;
  }
  digitalWrite(8, LOW);
  return sampleSum / (float)sampleCount;
}

int readLight() {

  int sampleCount = 5;
  float sampleSum = 0.0;

  for (int sample = 0; sample < sampleCount; sample++) {
    float fLux;
    Wire.beginTransmission(0x44);
    Wire.write(0x00);
    Wire.endTransmission();
    delay(50);

    Wire.requestFrom(0x44, 2);
    uint16_t iData;
    uint8_t  iBuff[2];
    while (Wire.available()) {
      Wire.readBytes(iBuff, 2);
      iData = (iBuff[0] << 8) | iBuff[1];
      uint16_t fraction = iData & 0x0FFF;
      uint16_t exponent = (iData & 0xF000) >> 12;
      fLux = fraction * (0.01 * pow(2, exponent));
    }
    sampleSum += fLux;
  }

  return sampleSum / (float)sampleCount;
}

void initializeLightSensor() {
  Wire.begin();
  Wire.beginTransmission(0x44);
  // Turn on the sensor
  Wire.write(0x01);
  Wire.write(0xCE);
  Wire.write(0x10);
  Wire.endTransmission();
}
