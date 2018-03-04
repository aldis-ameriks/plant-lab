#include <RFM12B.h>
#include <avr/sleep.h>
#include <I2CSoilMoistureSensor.h>
#include <Wire.h>
#include <ArduinoJson.h>
#include <LowPower.h>

// You will need to initialize the radio by telling it what ID it has and what network it's on
// The NodeID takes values from 1-127, 0 is reserved for sending broadcast messages (send to all nodes)
// The Network ID takes values from 0-255
// By default the SPI-SS line used is D10 on Atmega328. You can change it by calling .SetCS(pin) where pin can be {8,9,10}
#define NODEID        2  //network ID used for this unit
#define NETWORKID    99  //the network ID we are on
#define GATEWAYID     1  //the node ID we're sending to
#define SERIAL_BAUD  115200
#define REQUEST_ACK  true
#define ACK_TIME     50
#define DELAY_BEFORE_SLEEP (long)1000

uint8_t KEY[] = "!Encrypted123%$£";
RFM12B radio;

int MOISTURE_DRY = 210;
int MOISTURE_WET = 730;
I2CSoilMoistureSensor sensor;

void setup() {
  Serial.begin(SERIAL_BAUD);

  // Init sensor
  Wire.begin();
  sensor.begin(); // reset sensor
  delay(1000); // give some time to boot up
  Serial.print("I2C Soil Moisture Sensor Address: ");
  Serial.println(sensor.getAddress(), HEX);
  Serial.print("Sensor Firmware version: ");
  Serial.println(sensor.getVersion(), HEX);

  // Init RFM12B in transmit mode
  radio.Initialize(NODEID, RF12_433MHZ, NETWORKID);
  radio.Encrypt(KEY);
  radio.Sleep();
  Serial.println("Transmitting...\n\n");
}

void loop() {
  while (sensor.isBusy()) delay(500);

  int moisture = sensor.getCapacitance();
  float moisturePrecentage = (1 - (MOISTURE_WET-moisture)/(MOISTURE_WET-(float)MOISTURE_DRY)) * 100;
  int temperature = sensor.getTemperature()/(float)10;
  unsigned int light = sensor.getLight(true);
  sensor.sleep();

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["moisture"] = moisture;
  root["moisture_precentage"] = moisturePrecentage;
  root["m_dry"] = MOISTURE_DRY;
  root["m_wet"] = MOISTURE_WET;
  root["temperature"] = temperature;
  root["light"] = light;
  root["nodeid"] = NODEID;

  String result;
  root.printTo(result);
  Serial.print(result);
  Serial.println("");

  sendData(result);
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


