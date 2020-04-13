#include <Arduino.h>
#include <EEPROM.h>
#include <Ethernet.h>
#include <RF24.h>
#include <SPI.h>
#include <main.h>
#include <secrets.h>

#define NODE_ID 10
#define DEBUG false

RF24 radio(7, 8);
const byte address[6] = "00001";

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
EthernetClient client;

const char server[] = "api.plant.kataldi.com";
const uint16_t port = 80;

char data[sizeof(payload)];
char postData[80];

char accessKey[25];
bool isPaired = false;
char discoverResponse[25];
uint8_t newLines = 0;
uint8_t discoverResponseCursor = 0;
unsigned long lastDiscoverRequestTime = 0;
const unsigned long discoverRequestInterval = 5000;

void setup() {
    Serial.begin(SERIAL_BAUD);
    while (!Serial) {
        ;  // wait for serial port to connect.
    }
    EEPROM.begin();
    Serial.print("Loading access key from eeprom - ");
    initAccessKey();
    Serial.println(isPaired);

    Serial.println("Setting up RF24");
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

    Serial.println("Setting up ethernet");
    // give the ethernet module time to boot up
    delay(1000);
    Ethernet.begin(mac);
    Serial.print("My IP address: ");
    Serial.println(Ethernet.localIP());

    Serial.println("End of setup");
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
        Serial.println("-----------------------------");
    }
}

void loop() {
    // TODO: Support encryption
    // TODO: Persist readings that can be replayed when there's network
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
            discoverResponse[discoverResponseCursor] = c;
            discoverResponseCursor++;
        }
    }

    if (discoverResponse[sizeof(discoverResponse) - 2]) {
        // Null terminate accesskey cstring
        discoverResponse[sizeof(discoverResponse) - 1] = 0x00;

        Serial.println("Received accessKey");
        writeAccessKey(discoverResponse);
        clearDiscoverRequestData();
        isPaired = true;
        attachInterrupt(0, receiveData, FALLING);
    }

    if (millis() - lastDiscoverRequestTime > discoverRequestInterval) {
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
    Serial.print("Writing: ");
    Serial.println(key);
    uint8_t j = 0;
    for (uint8_t i = EEPROM_ADDRESS; i < EEPROM_ADDRESS + sizeof(accessKey); i++) {
        EEPROM.write(i, key[j]);
        j++;
    }
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
        Serial.println("Sending request");
        Serial.println(postData);

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
        Serial.println("Connection failed");
    }
}

void sendDiscoverRequest() {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        Serial.print("Sending discover request - ");
        Serial.println(NODE_ID);

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
        Serial.println("Connection failed");
    }
}

void clearDiscoverRequestData() {
    memset(discoverResponse, 0, sizeof(discoverResponse));
    discoverResponseCursor = 0;
    newLines = 0;
}

void printBytes() {
    for (unsigned int i = 0; i < sizeof(payload); i++) {
        Serial.print((int)data[i]);
        Serial.print(", ");
    }
    Serial.println("");
}

void printPayload() {
    Serial.println("Received:");
    Serial.print("device_id: ");
    Serial.println(payload.nodeId);
    Serial.print("moisture: ");
    Serial.println(payload.moisture);
    Serial.print("moistureRaw: ");
    Serial.println(payload.moistureRaw);
    Serial.print("moistureMin: ");
    Serial.println(payload.moistureMin);
    Serial.print("moistureMax: ");
    Serial.println(payload.moistureMax);
    Serial.print("temperature: ");
    Serial.println(payload.temperature);
    Serial.print("light: ");
    Serial.println(payload.light);
    Serial.print("batteryVoltage: ");
    Serial.println(payload.batteryVoltage);
    Serial.print("firmware: ");
    Serial.println(payload.firmware);
}
