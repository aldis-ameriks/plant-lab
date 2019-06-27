// Simple serial pass through program
// It initializes the RFM12B radio with optional encryption and passes through
// any valid messages to the serial port felix@lowpowerlab.com

#include <RFM12B.h>
#include <SPI.h>
#include <Ethernet.h>

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

// assign a MAC address for the ethernet controller.
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};

// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(192, 168, 0, 177);
IPAddress myDns(192, 168, 0, 1);
EthernetClient client;

char server[] = "api.plant.kataldi.com";

void setup() {
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  radio.Initialize(NODEID, RF12_433MHZ, NETWORKID);
  radio.Encrypt(KEY); // comment this out to disable encryption

  // give the ethernet module time to boot up:
  delay(1000);

  Ethernet.begin(mac, ip, myDns);
  // print the Ethernet board/shield's IP address:
  Serial.print("My IP address: ");
  Serial.println(Ethernet.localIP());
}

void loop() {
  if (radio.ReceiveComplete()) {
    if (radio.CRCPass()) {
      for (byte i = 0; i < *radio.DataLen; i++) {
        Serial.print((char)radio.Data[i]);
      }
      Serial.println();

      sendHttpRequestWithData(radio.Data);

      if (radio.ACKRequested()) {
        radio.SendACK();
      }
    } else {
      Serial.print("BAD-CRC");
    }
  }
}

void sendHttpRequestWithData(String data) {
  // close any connection before send a new request.
  // This will free the socket on the WiFi shield
  client.stop();

  String postData = "{\"query\":\"mutation($input: String!) {saveReading(input: $input)}\",\"variables\":{\"input\":\"" + data + "\"}}";

  if (client.connect(server, 80)) {
    Serial.println("Sending request");

    client.println("POST /graphql HTTP/1.1");
    client.println("Host: api.plant.kataldi.com");
    client.println("User-Agent: arduino-ethernet");
    client.println("access-key: ---");
    client.println("content-type: application/json");
    client.println("Connection: close");
    client.print("Content-Length: ");
    client.println(postData.length());
    client.println();
    client.println(postData);

  } else {
    Serial.println("connection failed");
  }
}
