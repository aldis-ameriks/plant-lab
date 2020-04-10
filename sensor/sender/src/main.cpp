#include <Arduino.h>
#include <RF24.h>
#include <SPI.h>

#define SERIAL_BAUD 115200
#define NODE_ID 999

// Maximum payload size is 32 bytes
struct Payload {
    uint16_t nodeId;
    uint16_t readingId;
    uint8_t moisture;
    uint16_t moistureRaw;
    uint16_t moistureMin;
    uint16_t moistureMax;
    int8_t temperature;
    uint16_t batteryVoltage;
    uint32_t light;
    uint16_t firmware;
} payload;

RF24 radio(7, 8);
const byte address[6] = "00001";

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
    radio.setRetries(15, 25);
    radio.openWritingPipe(address);
    radio.stopListening();

    Serial.println("End of setup");
}

void sendData(Payload payload, uint8_t retries = 0) {
    if (retries == 5) {
        Serial.println("Max retry count reached, giving up.");
        return;
    }

    retries++;

    if (!radio.write(&payload, sizeof(payload))) {
        Serial.print("Failed to send data, retrying. Attempt: ");
        Serial.println(retries);
        sendData(payload, retries);
    } else {
        if (radio.isAckPayloadAvailable()) {
            uint16_t nodeId;
            radio.read(&nodeId, sizeof(nodeId));
            Serial.print("Received ack payload: ");
            Serial.println(nodeId);

            if (nodeId != NODE_ID) {
                Serial.println("Different nodeId in ack payload, retrying.");
                sendData(payload, retries);
            }

        } else {
            Serial.println("Failed to receive ack payload, retrying.");
            sendData(payload, retries);
        }
    }
}

void loop() {
    payload.nodeId = NODE_ID;
    payload.readingId = random(65535);
    payload.moisture = 56;
    payload.moistureRaw = 200;
    payload.moistureMin = 100;
    payload.moistureMax = 700;
    payload.temperature = 24;
    payload.light = 10000;
    payload.firmware = 10;
    payload.batteryVoltage = 700;

    Serial.print("Payload size: ");
    Serial.println(sizeof(payload));

    sendData(payload);
    delay(10000);
}