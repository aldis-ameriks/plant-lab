#include <RFM69.h>
#include <RFM69_ATC.h>
#include <SPI.h>
#include <Ethernet.h>
#include "secrets.h"

#define SERIAL_BAUD 115200

#define NODEID      1
#define NETWORKID   100
#define FREQUENCY     RF69_433MHZ
#define ENCRYPTKEY    RADIO_ENCRYPTION_KEY
#define IS_RFM69HW_HCW  //uncomment only for RFM69HW/HCW! Leave out if you have RFM69W/CW!
#define SS_PIN 9
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

bool promiscuousMode = false; // set to 'true' to sniff all packets on the same network

// assign a MAC address for the ethernet controller.
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};

// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(192, 168, 0, 177);
IPAddress myDns(192, 168, 0, 1);
EthernetClient client;

char server[] = "api.plant.kataldi.com";
char apiAccessKey[] = API_ACCESS_KEY;

void setup() {
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {
    ; // wait for serial port to connect.
  }
  radio.initialize(FREQUENCY, NODEID, NETWORKID);
//  radio.setCS(SS_PIN); // TODO: Use different SS pin for rfm69 to avoid conflict with ethernet shield

  #ifdef IS_RFM69HW_HCW
    radio.setHighPower(); //must include this only for RFM69HW/HCW!
  #endif

  radio.encrypt(ENCRYPTKEY);
  radio.promiscuous(promiscuousMode);
  
  // give the ethernet module time to boot up:
  delay(1000);

  Ethernet.begin(mac, ip, myDns);
  // print the Ethernet board/shield's IP address:
  Serial.print("My IP address: ");
  Serial.println(Ethernet.localIP());
  Serial.println("Listening");
}

void loop() {
  if (radio.receiveDone()) {
    Serial.print('[');Serial.print(radio.SENDERID, DEC);Serial.print("] ");
    Serial.print(" [RX_RSSI:");Serial.print(radio.readRSSI());Serial.print("]");
    if (promiscuousMode) {
      Serial.print("to [");Serial.print(radio.TARGETID, DEC);Serial.print("] ");
    }

    for (byte i = 0; i < radio.DATALEN; i++) {
      Serial.print((char)radio.DATA[i]);
    }

    sendHttpRequestWithData((char*)radio.DATA);

    if (radio.ACKRequested()) {
      radio.sendACK();
    }

    if (radio.ACKRequested()) {
      radio.sendACK();
      Serial.print(" - ACK sent");
    }
    Serial.println();
  }
}

void sendHttpRequestWithData(String data) {
  // close any connection before send a new request.
  client.stop();

  String postData = "{\"query\":\"mutation($input: String!) {saveReading(input: $input)}\",\"variables\":{\"input\":\"" + data + "\"}}";

  if (client.connect(server, 80)) {
    Serial.println("Sending request");

    client.println("POST /graphql HTTP/1.1");
    client.println("Host: api.plant.kataldi.com");
    client.println("User-Agent: arduino-ethernet");
    client.print("access-key: ");
    client.println(apiAccessKey);
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.print("Content-Length: ");
    client.println(postData.length());
    client.println();
    client.println(postData);

  } else {
    Serial.println("Connection failed");
  }
}
