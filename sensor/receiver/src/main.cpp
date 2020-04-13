#include <Arduino.h>
#include <EEPROM.h>
#include <Ethernet.h>
#include <RF24.h>
#include <SPI.h>
#include <main.h>
#include <secrets.h>

#define NODE_ID 10

RF24 radio(7, 8);
const byte address[6] = "00001";

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
EthernetClient client;

const char server[] = "api.plant.kataldi.com";
const uint16_t port = 80;

char data[sizeof(payload)];
char postData[80];

char accessKey[25];
char pairingAccessKey[25];
bool isPaired = false;
char response[25];
uint8_t newLines = 0;
uint8_t responseCursor = 0;
unsigned long lastDiscoverRequestTime = 0;
const unsigned long discoverRequestInterval = 5000;

bool isPairing = false;
uint8_t pairingConfirmedAttempts = 0;
unsigned long lastPairingCnfirmedRequestTime = 0;
const unsigned long pairingConfirmedRequestInterval = 5000;

void setup() {
    Serial.begin(SERIAL_BAUD);
    while (!Serial) {
        ;  // wait for serial port to connect.
    }
    EEPROM.begin();
    debug.print("Loading access key from eeprom - ");
    initAccessKey();
    debug.println(isPaired);

    debug.println("Setting up RF24");
    radio.begin();
    radio.setChannel(110);
    radio.setAutoAck(1);
    radio.enableAckPayload();
    radio.setRetries(15, 25);
    radio.setPALevel(RF24_PA_MAX);
    radio.setDataRate(RF24_250KBPS);
    radio.openReadingPipe(0, address);
    radio.maskIRQ(1, 1, 0);
    radio.startListening();

    if (isPaired) {
        attachInterrupt(0, receiveData, FALLING);
    }

    debug.println("Setting up ethernet");
    // give the ethernet module time to boot up
    delay(1000);
    Ethernet.begin(mac);
    debug.print("My IP address: ");
    debug.println(Ethernet.localIP());

    debug.println("End of setup");
}

void receiveData() {
    while (radio.available()) {
        memset(&payload, 0, sizeof(payload));
        memset(&data, 0, sizeof(data));
        memset(&postData, 0, sizeof(postData));

        bool goodSignal = radio.testRPD();

        radio.read(&data, sizeof(payload));
        memcpy(&payload, data, sizeof(payload));
        radio.writeAckPayload(0, &payload.nodeId, sizeof(&payload.nodeId));

#if DEBUG == true
        printBytes();
        printPayload();
#endif

        formatData(goodSignal ? 1 : 0);
        sendReadingData();
        debug.println("-----------------------------");
    }
}

void loop() {
    // TODO: Check response and reset access key if received 403
    // TODO: Support encryption
    // TODO: Persist readings that can be replayed when there's network outage
    // TODO: Factory resetting device
    if (isPaired) {
        return;
    }

    if (client.available()) {
        char c = client.read();

        if (c == 0x0A) {
            newLines++;
        }

        if (newLines == 6 && c != 0x0A) {
            response[responseCursor] = c;
            responseCursor++;
        }
    }

    if (isPairing && strcmp(response, "success") == 0) {
        isPairing = false;
        isPaired = true;
        writeAccessKey(pairingAccessKey);
        attachInterrupt(0, receiveData, FALLING);
        return;
    }

    if (isPairing && (millis() - lastPairingCnfirmedRequestTime > pairingConfirmedRequestInterval)) {
        sendPairingConfirmedRequest(pairingAccessKey);
        lastPairingCnfirmedRequestTime = millis();
        pairingConfirmedAttempts++;

        if (pairingConfirmedAttempts > 5) {
            isPairing = false;
        }
    }

    if (!isPairing && response[sizeof(response) - 2]) {
        // Null terminate accesskey cstring
        response[sizeof(response) - 1] = 0x00;

        debug.println("Received accessKey");
        memcpy(pairingAccessKey, response, sizeof(pairingAccessKey));
        clearDiscoverRequestData();
        isPairing = true;
    }

    if (!isPairing && (millis() - lastDiscoverRequestTime > discoverRequestInterval)) {
        sendDiscoverRequest();
        clearDiscoverRequestData();
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
    debug.print("Writing: ");
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

void sendReadingData() {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        debug.println("Sending request");
        debug.println(postData);

        client.println("POST /reading HTTP/1.1");
        client.print("Host:");
        client.println(server);
        client.println("User-Agent: arduino-ethernet");
        client.print("access-key: ");
        client.println(accessKey);
        client.println("Content-Type: text/plain");
        client.println("Connection: close");
        client.print("Content-Length: ");
        client.println(strlen(postData));
        client.println();
        client.println(postData);
    } else {
        debug.println("Connection failed");
    }
}

void sendDiscoverRequest() {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        debug.print("Sending discover request - ");
        debug.println(NODE_ID);

        client.println("POST /discover HTTP/1.1");
        client.print("Host: ");
        client.println(server);
        client.println("User-Agent: arduino-ethernet");
        client.println("Content-Type: text/plain");
        client.println("Connection: close");
        client.print("Content-Length: ");
        client.println(sizeof(NODE_ID));
        client.println();
        client.println(NODE_ID);

    } else {
        debug.println("Connection failed");
    }
}

void sendPairingConfirmedRequest(char* newAccessKey) {
        // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        debug.print("Sending pairing confirmed request - ");
        debug.println(NODE_ID);

        client.println("POST /confirm-pairing HTTP/1.1");
        client.print("Host: ");
        client.println(server);
        client.println("User-Agent: arduino-ethernet");
        client.print("access-key: ");
        client.println(newAccessKey);
        client.println("Content-Type: text/plain");
        client.println("Connection: close");
        client.print("Content-Length: ");
        client.println(sizeof(NODE_ID));
        client.println();
        client.println(NODE_ID);

    } else {
        debug.println("Connection failed");
    }
}

void clearDiscoverRequestData() {
    memset(response, 0, sizeof(response));
    responseCursor = 0;
    newLines = 0;
}

void printBytes() {
    for (unsigned int i = 0; i < sizeof(payload); i++) {
        debug.print((int)data[i]);
        debug.print(", ");
    }
    debug.println("");
}

void printPayload() {
    debug.println("Received:");
    debug.print("device_id: ");
    debug.println(payload.nodeId);
    debug.print("action: ");
    debug.println((int)payload.action);
    debug.print("moisture: ");
    debug.println(payload.moisture);
    debug.print("moistureRaw: ");
    debug.println(payload.moistureRaw);
    debug.print("moistureMin: ");
    debug.println(payload.moistureMin);
    debug.print("moistureMax: ");
    debug.println(payload.moistureMax);
    debug.print("temperature: ");
    debug.println(payload.temperature);
    debug.print("light: ");
    debug.println(payload.light);
    debug.print("batteryVoltage: ");
    debug.println(payload.batteryVoltage);
    debug.print("firmware: ");
    debug.println(payload.firmware);
}
