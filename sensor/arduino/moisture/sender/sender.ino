// Simple RFM12B sender program, with ACK and optional encryption
// It initializes the RFM12B radio with optional encryption and passes through any valid messages to the serial port
// felix@lowpowerlab.com

#include <RFM12B.h>
#include <avr/sleep.h>
#include <I2CSoilMoistureSensor.h>
#include <Wire.h>

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
#define DELAY_BETWEEN_SENDS (long)1000 * 60 * 5

uint8_t KEY[] = "!Encrypted123%$£";
RFM12B radio;

float MOISTURE_DRY = 260;
int MOISTURE_WET = 560;
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

  Serial.print("Soil Moisture Capacitance: ");
  int moisture = sensor.getCapacitance();
  Serial.print(moisture); //read capacitance register
  Serial.print(", Temperature: ");
  Serial.println(sensor.getTemperature()/(float)10); //temperature register
  //Serial.print(", Light: ");
  //Serial.println(sensor.getLight(true)); //request light measurement, wait and read light register
  sensor.sleep();

  float moisturePrecentage = (1 - (MOISTURE_WET-moisture)/(MOISTURE_WET-MOISTURE_DRY)) * 100;
  String value = "";
  sendData(value + NODEID + ":M:" + moisture + ":" + moisturePrecentage + ":" + MOISTURE_DRY + ":" + MOISTURE_WET);
  delay(DELAY_BETWEEN_SENDS);
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


