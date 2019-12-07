#include <RFM69.h>
#include <RFM69_ATC.h>
#include <LowPower.h>
#include <Wire.h>
#include <avr/sleep.h>
#include "secrets.h"

#define SENSOR_ID 7
#include "config.h"

void setup() {
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {
    ; // Wait for serial port to connect
  }
  radio.initialize(FREQUENCY, SENSOR_ID, NETWORKID);

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
    operatingVoltage = batteryVoltage > REGULATOR_V ? REGULATOR_V : batteryVoltage;
  #endif

  int moisture = readMoisture();
  float moisturePercentage = (1 - (MOISTURE_MAX - moisture) / (MOISTURE_MAX - (float)MOISTURE_MIN)) * 100;

  float temperature = readTemperature(operatingVoltage);
  int light = readLight();

  String payload = "";
  payload += SENSOR_ID;
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

  #if SEND_DATA == true
    sendData(payload);
  #endif

  #if SLEEP == true
    enterSleep();
  #endif
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
  for (sleepCounter = 225; sleepCounter > 0; sleepCounter--) {
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
  delay(20);
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
  delay(20);

  float temperatureCoefficient = 100; // Temperature coefficient
  int sampleCount = 10;
  float sampleSum = 0.0;
  float temperature;

  for (int sample = 0; sample < sampleCount; sample++) {
    float temperatureRaw = (float)analogRead(A2);
    float temperatureVoltage = ((temperatureRaw + 0.5) * operatingVoltage / 1024.0);
    temperature = (temperatureVoltage - TEMPERATURE_OFFSET) * temperatureCoefficient;
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

/* 	CONFIG REGISTER BITS: RN3 RN2 RN1 RN0 CT M1 M0 OVF CRF FH FL L Pol ME FC1 FC0
	RN3 to RN0 = Range select:
                    1100 by default, enables auto-range
	CT = Conversion time bit
                    0 = 100ms conversion time
                    1 = 800ms conversion time (default)
	M1 to M0 = Mode bits
                    00 = Shutdown mode
                    01 = Single shot mode
                    10 = Continuous conversion (default)
                    11 = Continuous conversion
	OVF (Bit 8)     Overflow flag. When set the conversion result is overflown.
	CRF (Bit 7)     Conversion ready flag. Sets at end of conversion. Clears by read or write of the Configuration register.
	FH (Bit 6)      Flag high bit. Read only. Sets when result is higher that TH register. Clears when Config register is
					read or when Latch bit is 0 and the result goes bellow TH register.
	FL (Bit 5)      Flag low bit. Read only. Sets when result is lower that TL register. Clears when Config register is read
                    or when Latch bit is 0 and the result goes above TL register.
	L (Bit 4)       Latch bit. Read/write bit. Default 1, Controls Latch/transparent functionality of FH and FL bits. When
                    L = 1 the Alert pin works in window comparator mode with Latched functionality When L = 0 the Alert pin
                    works in transparent mode and the two limit registers provide the hysteresis.
	Pol (Bit 3)     Polarity. Read/write bit. Default 0, Controls the active state of the Alert pin. Pol = 0 means Alert
                    active low.
	ME (Bit 2)      Exponent mask. In fixed range modes masks the exponent bits in the result register to 0000.
	FC1 to FC0  -   Fault count bits. Read/write bits. Default 00 - the first fault will trigger the alert pin.
*/

void initializeLightSensor() {
  Wire.begin();
  Wire.beginTransmission(0x44);
  // Turn on the sensor
  Wire.write(0x01);
  Wire.write(0b1100001000010000); // 100ms, one shot
  Wire.endTransmission();
}
