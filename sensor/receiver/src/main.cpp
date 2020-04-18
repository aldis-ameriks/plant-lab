#include <Arduino.h>
#include <EEPROM.h>
#include <RF24.h>
#include <SPI.h>
#include <api.h>
#include <main.h>
#include <secrets.h>

#define NODE_ID 10

Payload payload;
AckPayload ackPayload;
RF24 radio(7, 8);
Debug debug;
ApiClient apiClient;

const byte address[6] = "00001";
char encryptionKey[25] = "PlaceholderEncryptionKey";

char data[sizeof(payload)];
char postData[80];

char accessKey[25];
char pairingAccessKey[25];
bool isPaired = false;

unsigned long lastDiscoverRequestTime = 0;
const unsigned long discoverRequestInterval = 5000;

uint16_t pendingPairingNodeId;
bool isPairing = false;
size_t pairedSensorCount = 0;
uint8_t pairedSensors[32];
uint8_t pairingConfirmedAttempts = 0;
unsigned long lastPairingCnfirmedRequestTime = 0;
const unsigned long pairingConfirmedRequestInterval = 5000;

void setup() {
    Serial.begin(SERIAL_BAUD);
    while (!Serial) {
        ;  // wait for serial port to connect.
    }
    EEPROM.begin();
    debug.print(F("Loading access key from eeprom - "));
    initAccessKey();
    debug.println(isPaired);

    debug.println(F("Setting up RF24"));
    radio.begin();
    radio.setChannel(110);
    radio.setAutoAck(1);
    radio.enableAckPayload();
    radio.setRetries(15, 25);
    radio.setPALevel(RF24_PA_MAX);
    radio.setDataRate(RF24_250KBPS);
    radio.openReadingPipe(0, address);
    radio.startListening();

    debug.println(F("Setting up api client"));
    apiClient.init(accessKey);

    debug.println(F("End of setup"));
}

void receiveData() {
    while (radio.available()) {
        memset(&payload, 0, sizeof(payload));
        memset(&data, 0, sizeof(data));
        memset(&postData, 0, sizeof(postData));
        memset(&ackPayload, 0, sizeof(ackPayload));

        bool goodSignal = radio.testRPD();

        radio.read(&data, sizeof(payload));
        memcpy(&payload, data, sizeof(payload));

        ackPayload.nodeId = payload.nodeId;

        if (payload.action == Action::pairing) {
            debug.print(F("Received pairing payload, nodeId: "));
            debug.println(payload.nodeId);

            if (isSensorPaired(payload.nodeId)) {
                debug.println(F("Sensor is paired"));
                ackPayload.status = 1;
                memcpy(ackPayload.encryptionKey, encryptionKey, sizeof(encryptionKey));
                radio.writeAckPayload(0, &ackPayload, sizeof(ackPayload));
            } else {
                pendingPairingNodeId = payload.nodeId;
                apiClient.sendDiscoverRequest(payload.nodeId);
            }
        }

        radio.writeAckPayload(0, &ackPayload, sizeof(&ackPayload));

#if DEBUG == true
        printBytes();
        printPayload();
#endif

        if (payload.action == Action::send) {
            formatData(goodSignal ? 1 : 0);
            apiClient.sendReadingData(postData);
        }
        debug.println("-----------------------------");
    }
}

void loop() {
    // TODO: Check response and reset access key if received 403
    // TODO: Support encryption
    // TODO: Factory resetting device

    if (isPaired) {
        receiveData();
    }

    if (isPaired && !pendingPairingNodeId) {
        return;
    }

    apiClient.parseResponse();

    if (strcmp(apiClient.response, "success: sensor paired") == 0) {
        apiClient.clearResponseData();
        if (!pendingPairingNodeId) {
            return;
        }

        pairedSensorCount++;
        if (pairedSensorCount == sizeof(pairedSensors)) {
            pairedSensorCount = 0;
        }
        // TODO: Extract nodeid from response
        debug.print(F("Pending pairing nodeId: "));
        debug.println(pendingPairingNodeId);
        pairedSensors[pairedSensorCount] = pendingPairingNodeId;
        pendingPairingNodeId = 0;
        return;
    }

    if (isPairing && strcmp(apiClient.response, "success: hub paired") == 0) {
        apiClient.clearResponseData();
        isPairing = false;
        isPaired = true;
        writeAccessKey(pairingAccessKey);
        attachInterrupt(0, receiveData, FALLING);
        return;
    }

    if (isPairing && (millis() - lastPairingCnfirmedRequestTime > pairingConfirmedRequestInterval)) {
        apiClient.sendPairingConfirmedRequest(NODE_ID, pairingAccessKey);
        lastPairingCnfirmedRequestTime = millis();
        pairingConfirmedAttempts++;

        if (pairingConfirmedAttempts > 5) {
            isPairing = false;
        }
    }

    if (!isPairing && !isPaired && apiClient.response[sizeof(apiClient.response) - 2]) {
        // Null terminate accesskey cstring
        apiClient.response[sizeof(apiClient.response) - 1] = 0x00;

        debug.println(F("Received accessKey"));
        memcpy(pairingAccessKey, apiClient.response, sizeof(pairingAccessKey));
        debug.println(pairingAccessKey);
        apiClient.clearResponseData();
        isPairing = true;
    }

    if (!isPairing && !isPaired && (millis() - lastDiscoverRequestTime > discoverRequestInterval)) {
        apiClient.sendDiscoverRequest(NODE_ID);
        apiClient.clearResponseData();
        lastDiscoverRequestTime = millis();
    }
}

void initAccessKey() {
    uint8_t j = 0;
    for (uint8_t i = EEPROM_ADDRESS; i < EEPROM_ADDRESS + sizeof(accessKey); i++) {
        uint8_t val = EEPROM.read(i);
        accessKey[j] = (char)val;
        j++;
    }

    if (strlen(accessKey) == sizeof(accessKey) - 1) {
        isPaired = true;
    }
}

void writeAccessKey(char* key) {
    debug.print(F("Writing: "));
    debug.println(key);
    uint8_t j = 0;
    for (uint8_t i = EEPROM_ADDRESS; i < EEPROM_ADDRESS + sizeof(accessKey); i++) {
        EEPROM.write(i, key[j]);
        j++;
    }
    memcpy(accessKey, key, sizeof(accessKey));
}

void formatData(uint8_t signal) {
    // Convert to char* due to Arduino not supporting %f in sprintf
    char moisture[7];
    char temperature[7];
    char batteryVoltage[5];
    char firmware[5];
    dtostrf(payload.moisture / (double)100, 4, 2, moisture);
    dtostrf(payload.temperature / (double)100, 4, 2, temperature);
    dtostrf(payload.batteryVoltage / (double)100, 1, 2, batteryVoltage);
    dtostrf(payload.firmware / (double)10, 3, 1, firmware);

    sprintf(postData, "%u;%u;%s;%u;%u;%s;%lu;%s;%d;%u;%s", payload.nodeId, payload.moistureRaw, moisture,
            payload.moistureMin, payload.moistureMax, temperature, payload.light, batteryVoltage, signal,
            payload.readingId, firmware);
}

void printBytes() {
    for (unsigned int i = 0; i < sizeof(payload); i++) {
        debug.print((int)data[i]);
        debug.print(", ");
    }
    debug.println("");
}

void printPayload() {
    debug.println(F("Received:"));
    debug.print(F("device_id: "));
    debug.println(payload.nodeId);
    debug.print(F("action: "));
    debug.println((int)payload.action);
    debug.print(F("moisture: "));
    debug.println(payload.moisture);
    debug.print(F("moistureRaw: "));
    debug.println(payload.moistureRaw);
    debug.print(F("moistureMin: "));
    debug.println(payload.moistureMin);
    debug.print(F("moistureMax: "));
    debug.println(payload.moistureMax);
    debug.print(F("temperature: "));
    debug.println(payload.temperature);
    debug.print(F("light: "));
    debug.println(payload.light);
    debug.print(F("batteryVoltage: "));
    debug.println(payload.batteryVoltage);
    debug.print(F("firmware: "));
    debug.println(payload.firmware);
}

bool isSensorPaired(uint16_t sensorNodeId) {
    for (size_t i = 0; i < sizeof(pairedSensors); i++) {
        if (pairedSensors[i] == sensorNodeId) {
            return true;
        }
    }
    return false;
}
