// Simple serial pass through program
// It initializes the RFM12B radio with optional encryption and passes through
// any valid messages to the serial port felix@lowpowerlab.com

#include <RFM12B.h>

// You will need to initialize the radio by telling it what ID it has and what
// network it's on The NodeID takes values from 1-127, 0 is reserved for sending
// broadcast messages (send to all nodes) The Network ID takes values from 0-255
// By default the SPI-SS line used is D10 on Atmega328. You can change it by
// calling .SetCS(pin) where pin can be {8,9,10}
#define NODEID 1     // network ID used for this unit
#define NETWORKID 99 // the network ID we are on
#define SERIAL_BAUD 115200

// encryption is OPTIONAL
// to enable encryption you will need to:
// - provide a 16-byte encryption KEY (same on all nodes that talk encrypted)
// - to call .Encrypt(KEY) to start encrypting
// - to stop encrypting call .Encrypt(NULL)
uint8_t KEY[] = "!Encrypted123%$£";

// Need an instance of the Radio Module
RFM12B radio;
void setup() {
  radio.Initialize(NODEID, RF12_433MHZ, NETWORKID);
  radio.Encrypt(KEY); // comment this out to disable encryption
  Serial.begin(SERIAL_BAUD);
}

void loop() {
  if (radio.ReceiveComplete()) {
    if (radio.CRCPass()) {
      for (byte i = 0; i < *radio.DataLen; i++) {
        Serial.print((char)radio.Data[i]);
      }

      if (radio.ACKRequested()) {
        radio.SendACK();
      }
    } else {
      Serial.print("BAD-CRC");
    }
    Serial.println();
  }
}
