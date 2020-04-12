#include <Arduino.h>
#include <LowPower.h>
#include <RF24.h>
#include <SPI.h>
#include <Wire.h>
#include <avr/sleep.h>
#include <main.h>

#define NODE_ID 12
#define DEBUG true

RF24 radio(7, 8);
const byte address[6] = "00001";

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
    radio.openWritingPipe(address);
    radio.stopListening();

    Serial.println("Setting up Wire");
    Wire.begin();

    Serial.println("Setting up light sensor");
    initializeLightSensor();

    // pinMode(13, OUTPUT); // SCK pin LED, flashes when interfacing with RFM69
    pinMode(6, OUTPUT);
    pinMode(5, OUTPUT);

    pinMode(7, OUTPUT);  // Powers capacitance sensor
    pinMode(8, OUTPUT);  // Powers temperature sensor

    Serial.println("End of setup");
}

void loop() {
    memset(&payload, 0, sizeof(payload));

    float batteryVoltage = readBatteryVoltage();
    float operatingVoltage = batteryVoltage;

    int moisture = readMoisture();
    float MOISTURE_MAX = (50 * operatingVoltage) + 242;
    float MOISTURE_MIN = (50 * operatingVoltage) + 634;
    float moisturePercentage = (1 - (MOISTURE_MAX - moisture) / (MOISTURE_MAX - (float)MOISTURE_MIN)) * 100;

    float temperature = readTemperature();
    int light = readLight();

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

    Serial.print("Payload size: ");
    Serial.println(sizeof(payload));

    if (SEND_DATA == true) {
        char data[sizeof(payload)];
        memcpy(data, &payload, sizeof(payload));
        // TODO: Encrypt payload

#if DEBUG == true
        printBytes(data);
#endif

        sendData(data);
    }

    if (SLEEP == true) {
        enterSleep();
    }
}

void initializeLightSensor() {
    Wire.beginTransmission(0x44);
    Wire.write(0x01);
    Wire.write(0xCA);  // 800ms, single shot
    Wire.write(0x10);
    Wire.endTransmission();
}

void sendData(char* data, uint8_t retries) {
    if (retries == 5) {
        Serial.println("Max retry count reached, giving up.");
        return;
    }

    retries++;

    if (retries > 1) {
        delay(100);
    }

    if (!radio.write(data, sizeof(payload))) {
        Serial.print("Failed to send data, retrying. Attempt: ");
        Serial.println(retries);
        sendData(data, retries);
    } else {
        if (radio.isAckPayloadAvailable()) {
            uint16_t nodeId;
            radio.read(&nodeId, sizeof(nodeId));
            Serial.print("Received ack payload: ");
            Serial.println(nodeId);

            if (nodeId != NODE_ID) {
                Serial.println("Different nodeId in ack payload, retrying.");
                sendData(data, retries);
            }

        } else {
            Serial.println("Failed to receive ack payload, retrying.");
            sendData(data, retries);
        }
    }
}

int readLight() {
    initializeLightSensor();
    delay(1000);
    Wire.beginTransmission(0x44);
    Wire.write(0x00);
    Wire.endTransmission();

    uint8_t buf[2];
    Wire.requestFrom(0x44, 2);

    int counter = 0;
    while (Wire.available() < 2) {
        counter++;
        delay(10);
        if (counter > 100) {
            return -1;
        }
    }

    Wire.readBytes(buf, 2);
    uint16_t data = (buf[0] << 8) | buf[1];
    uint16_t fraction = data & 0x0FFF;
    uint16_t exponent = (data & 0xF000) >> 12;
    return fraction * (0.01 * pow(2, exponent));
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
        Serial.print((int)data[i]);
        Serial.print(", ");
    }
    Serial.println("");
}