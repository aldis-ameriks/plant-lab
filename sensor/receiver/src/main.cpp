#include <Arduino.h>
#include <Ethernet.h>
#include <RF24.h>
#include <SPI.h>
#include <secrets.h>

#define SERIAL_BAUD 115200
#define NODE_ID 10

struct Payload {
    uint16_t nodeId;
    uint16_t readingId;
    uint8_t moisture;
    uint16_t moistureRaw;
    uint16_t moistureMin;
    uint16_t moistureMax;
    int16_t temperature;
    uint16_t batteryVoltage;
    uint32_t light;
    uint16_t firmware;
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
    radio.setChannel(110);
    radio.setAutoAck(1);
    radio.enableAckPayload();
    radio.setRetries(15, 25);
    radio.setPALevel(RF24_PA_MAX);
    radio.setDataRate(RF24_250KBPS);
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

void sendHttpRequestWithData(String data) {
    // close any connection before send a new request.
    client.stop();

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

String formatPayload(Payload payload, uint8_t signal) {
    String data = "";
    data += (String)payload.nodeId;
    data += ";";
    data += (String)payload.moistureRaw;
    data += ";";
    data += (String)(payload.moisture / (float)100);
    data += ";";
    data += (String)payload.moistureMin;
    data += ";";
    data += (String)payload.moistureMax;
    data += ";";
    data += (String)(payload.temperature / float(100));
    data += ";";
    data += (String)payload.light;
    data += ";";
    data += (String)(payload.batteryVoltage / float(100));
    data += ";";
    data += (String)signal;
    data += ";";
    data += (String)payload.readingId;
    data += ";";
    data += (String)(payload.firmware / float(10));
    return data;
}

void printPayload(Payload payload) {
    Serial.println("Received:");
    Serial.println("device_id: " + (String)payload.nodeId);
    Serial.println("reading_id: " + (String)payload.readingId);
    Serial.println("moisture: " + (String)payload.moisture);
    Serial.println("moisture_raw: " + (String)payload.moistureRaw);
    Serial.println("moisture_min: " + (String)payload.moistureMin);
    Serial.println("moisture_max: " + (String)payload.moistureMax);
    Serial.println("temperature: " + (String)payload.temperature);
    Serial.println("light: " + (String)payload.light);
    Serial.println("battery_voltage: " + (String)payload.batteryVoltage);
    Serial.println("firmware: " + (String)payload.firmware);
}

void loop() {
    // TODO: Support encryption
    // TODO: Separate receiving data / sending data with interrupts
    // TODO: Entering pairing mode
    // TODO: Factory resetting device

    while (radio.available()) {
        memset(&payload, 0, sizeof(payload));
        radio.writeAckPayload(0, &payload.nodeId, sizeof(&payload.nodeId));

        bool goodSignal = radio.testRPD();
        Serial.println(goodSignal ? "Strong signal > 64dBm" : "Weak signal < 64dBm");

        Serial.print("Receiving payload size: ");
        Serial.println(sizeof(payload));
        radio.read(&payload, sizeof(payload));

        printPayload(payload);
        String data = formatPayload(payload, goodSignal ? 1 : 0);

        sendHttpRequestWithData(data);
        Serial.println("-----------------------------");
    }
}
