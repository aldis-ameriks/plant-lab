#include <Arduino.h>
#include <Ethernet.h>
#include <RF24.h>
#include <SPI.h>
#include <secrets.h>

#define SERIAL_BAUD 115200
#define NODE_ID 1

struct Payload {
    uint8_t nodeId;
    char data[30];
} payload;

RF24 radio(7, 8);
const byte address[6] = "00001";

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
EthernetClient client;

char server[] = "api.plant.kataldi.com";
char apiAccessKey[] = API_ACCESS_KEY;

void setup() {
    Serial.begin(SERIAL_BAUD);
    while (!Serial) {
        ;  // wait for serial port to connect.
    }

    Serial.println("Setting up RF24");
    radio.begin();
    radio.setChannel(125);
    radio.setAutoAck(1);
    radio.enableAckPayload();
    radio.setRetries(15, 15);
    radio.openReadingPipe(0, address);
    radio.startListening();

    Serial.println("Setting up ethernet");
    // give the ethernet module time to boot up
    delay(1000);
    Ethernet.begin(mac);
    Serial.print("My IP address: ");
    Serial.println(Ethernet.localIP());

    Serial.println("End of setup");
}

void sendHttpRequestWithData(Payload payload, uint8_t signalQuality) {
    // close any connection before send a new request.
    client.stop();

    String data = (String)payload.nodeId + ";" + (String)payload.data + ";" + (String)signalQuality;

    String postData =
        "{\"query\":\"mutation($input: String!) {saveReading(input: "
        "$input)}\",\"variables\":{\"input\":\"" +
        data + "\"}}";

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

void loop() {
    // TODO: Entering pairing mode
    // TODO: Factory resetting device
    
    while (radio.available()) {
        radio.writeAckPayload(0, &payload.nodeId, sizeof(uint8_t));

        bool goodSignal = radio.testRPD();
        Serial.println(goodSignal ? "Strong signal > 64dBm" : "Weak signal < 64dBm");

        memset(payload.data, 0, 30);
        Serial.print("Receiving payload size: ");
        Serial.println(sizeof(payload));
        radio.read(&payload, sizeof(payload));

        // TODO: Support encryption
        Serial.print("Received: ");
        Serial.println(payload.data);

        sendHttpRequestWithData(payload, goodSignal ? 1 : 0);
    }
}
