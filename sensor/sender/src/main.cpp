#include <Arduino.h>
#include <EEPROM.h>
#include <LowPower.h>
#include <RF24.h>
#include <SPI.h>
#include <Wire.h>
#include <avr/sleep.h>
#include <main.h>
#include <sensors/light.h>

#define NODE_ID 12

State state;
Payload payload;
AckPayload ackPayload;
Debug debug;
RF24 radio(7, 8);

LightSensor lightSensor;

const byte address[6] = "00001";
const uint16_t pairingInterval = 5000;

void setup() {
    Serial.begin(SERIAL_BAUD);
    while (!Serial) {
        ;  // wait for serial port to connect.
    }

    EEPROM.begin();
    debug.print("Loading pairing state from eeprom - ");
    uint8_t value = EEPROM.read(EEPROM_ADDRESS);
    if (value == 1) {
        state = State::paired;
    } else {
        state = State::unpaired;
    }

    debug.println("Setting up RF24");
    radio.begin();
    radio.setChannel(110);
    radio.setAutoAck(1);
    radio.enableAckPayload();
    radio.setRetries(15, 25);
    radio.setPALevel(RF24_PA_MAX);
    radio.setDataRate(RF24_250KBPS);
    radio.openWritingPipe(address);
    radio.stopListening();

    if (state == State::paired) {
        initSensors();
    }

    debug.println("End of setup");
}

void loop() {
    if (state == State::paired) {
        processReadings();
    } else {
        processPairing();
    }
}

void initSensors() {
    debug.println("Setting up sensors");
    debug.println("Setting up Wire");
    Wire.begin();

    debug.println("Setting up light sensor");

    lightSensor.init();

    // pinMode(13, OUTPUT); // SCK pin LED, flashes when interfacing with RFM69
    pinMode(6, OUTPUT);
    pinMode(5, OUTPUT);

    pinMode(7, OUTPUT);  // Powers capacitance sensor
    pinMode(8, OUTPUT);  // Powers temperature sensor
}

void processReadings() {
    memset(&payload, 0, sizeof(payload));

    float batteryVoltage = readBatteryVoltage();
    float operatingVoltage = batteryVoltage;

    int moisture = readMoisture();
    float MOISTURE_MAX = (50 * operatingVoltage) + 242;
    float MOISTURE_MIN = (50 * operatingVoltage) + 634;
    float moisturePercentage = (1 - (MOISTURE_MAX - moisture) / (MOISTURE_MAX - (float)MOISTURE_MIN)) * 100;

    float temperature = readTemperature();
    int light = lightSensor.read();

    payload.nodeId = NODE_ID;
    payload.readingId = random(65535);
    payload.moisture = (int)(moisturePercentage * 100);
    payload.moistureRaw = moisture;
    payload.moistureMin = (int)MOISTURE_MIN;
    payload.moistureMax = (int)MOISTURE_MAX;
    payload.temperature = (int)(temperature * 100);
    payload.light = light;
    payload.firmware = 10;
    payload.batteryVoltage = (int)(batteryVoltage * 100);
    payload.action = Action::send;

    debug.print("Payload size: ");
    debug.println(sizeof(payload));

    if (SEND_DATA == true) {
        char data[sizeof(payload)];
        memcpy(data, &payload, sizeof(payload));
        // TODO: Encrypt payload

        printBytes(data);
        sendData(data);
    }

    if (SLEEP == true) {
        enterSleep();
    }
}

void processPairing() {
    debug.println("Starting pairing");
    memset(&payload, 0, sizeof(payload));

    payload.nodeId = NODE_ID;
    payload.action = Action::pairing;

    char data[sizeof(payload)];
    memcpy(data, &payload, sizeof(payload));
    printBytes(data);
    sendData(data);
    delay(pairingInterval);
}

void sendData(char* data, uint8_t retries) {
    memset(&ackPayload, 0, sizeof(ackPayload));

    if (retries == 5) {
        debug.println("Max retry count reached, giving up.");
        return;
    }

    retries++;

    if (retries > 1) {
        delay(100);
    }

    if (!radio.write(data, sizeof(payload))) {
        debug.print("Failed to send data, retrying. Attempt: ");
        debug.println(retries);
        sendData(data, retries);
    } else {
        if (radio.isAckPayloadAvailable()) {
            radio.read(&ackPayload, sizeof(AckPayload));
            debug.print("Received ack payload: ");
            debug.println(ackPayload.nodeId);

            if (ackPayload.nodeId != NODE_ID) {
                debug.println("Different nodeId in ack payload, retrying.");
                sendData(data, retries);
            }

            if (state == State::unpaired) {
                debug.println("Received pairing ack payload:");
                debug.print("status: ");
                debug.println(ackPayload.status);
                debug.print("encryption key:");
                debug.println(ackPayload.encryptionKey);

                debug.print("encryption key strlen: ");
                debug.println(strlen(ackPayload.encryptionKey));
                debug.print("encryption key size: ");
                debug.println(sizeof(ackPayload.encryptionKey));

                if (ackPayload.status && strlen(ackPayload.encryptionKey) == sizeof(ackPayload.encryptionKey)) {
                    // TODO: Persist encryption key
                    state = State::paired;
                    initSensors();
                }

                return;
            }

        } else {
            debug.print("Failed to receive ack payload, retrying. Attempt: ");
            debug.println(retries);
            sendData(data, retries);
        }
    }
}

int readMoisture() {
    digitalWrite(7, HIGH);
    delay(100);
    analogRead(A1);  // Discard first reading after ADC init
    delay(20);
    int sampleCount = 10;
    int sampleSum = 0.0;

    for (int sample = 0; sample < sampleCount; sample++) {
        int capacitance = analogRead(A1);
        delay(20);
        sampleSum += capacitance;
    }

    digitalWrite(7, LOW);
    return sampleSum / (float)sampleCount;
}

float readTemperature() {
    // TODO
    return 24;
}

float readBatteryVoltage() {
    analogReference(INTERNAL);
    delay(100);
    analogRead(0);  // Discard first reading after ADC init
    delay(50);
    int rawReading = analogRead(0);
    float batteryVoltage = ((rawReading + 0.5) / (float)1024) * INTERNAL_AREF * ((R1 + R2) / R2);
    analogReference(DEFAULT);
    delay(100);
    return batteryVoltage;
}

void enterSleep() {
    delay(DELAY_BEFORE_SLEEP);  // delay to avoid cutting off serial output

    // 30 minutes = 60x30 = 1800s
    // 1800 s / 8 s = 225
    unsigned int sleepCounter;
    for (sleepCounter = 225; sleepCounter > 0; sleepCounter--) {
        LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF);
    }
}

void printBytes(char* data) {
    for (unsigned int i = 0; i < sizeof(payload); i++) {
        debug.print((int)data[i]);
        debug.print(", ");
    }
    debug.println("");
}
