#include <Arduino.h>
#include <EEPROM.h>
#include <LowPower.h>
#include <RF24.h>
#include <SPI.h>
#include <Wire.h>
#include <avr/sleep.h>
#include <main.h>
#include <sensors/conductivity.h>
#include <sensors/light.h>
#include <sensors/moisture.h>
#include <sensors/temperature.h>

#define NODE_ID 12

State state;
Payload payload;
AckPayload ackPayload;
Debug debug;
RF24 radio(7, 8);

LightSensor lightSensor;
MoistureSensor moistureSensor;
TemperatureSensor temperatureSensor;
ConductivitySensor conductivitySensor;

const byte address[6] = "00001";
const uint16_t pairingInterval = 5000;
char encryptionKey[25];

void setup() {
    Serial.begin(SERIAL_BAUD);
    while (!Serial) {
        ;  // wait for serial port to connect.
    }

    EEPROM.begin();
    debug.print("Loading pairing state from eeprom - ");
    uint8_t value = EEPROM.read(EEPROM_STATE_ADDRESS);
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

    debug.println("Setting up sensors");
    Wire.begin();

    lightSensor.init();
    moistureSensor.init();
    temperatureSensor.init();
    conductivitySensor.init();

    // LEDs
    // pinMode(13, OUTPUT); // SCK pin LED, flashes when interfacing with RF24
    pinMode(PD6, OUTPUT);  // Green LED
    pinMode(PD5, OUTPUT);  // RED LED
    pinMode(PD3, INPUT);

    debug.println("End of setup");

    if (digitalRead(PD3) == LOW) {
        debug.println("Factory resetting device");
        factoryReset();
        state = State::unpaired;
        flashLeds();
    }
}

void loop() {
    if (state == State::paired) {
        processReadings();
    } else {
        processPairing();
    }
}

void processReadings() {
    memset(&payload, 0, sizeof(payload));

    float batteryVoltage = readBatteryVoltage();
    float operatingVoltage = batteryVoltage;

    int moisture = moistureSensor.read();
    // TODO: Move inside moisture module
    float MOISTURE_MAX = (50 * operatingVoltage) + 277;
    float MOISTURE_MIN = (50 * operatingVoltage) + 642;
    float moisturePercentage = (1 - (MOISTURE_MAX - moisture) / (MOISTURE_MAX - (float)MOISTURE_MIN)) * 100;

    float temperature = temperatureSensor.readTemperature();
    float humidity = temperatureSensor.readHumidity();
    uint32_t light = lightSensor.read();

    payload.nodeId = NODE_ID;
    payload.readingId = random(65535);
    payload.moisture = (int)(moisturePercentage * 100);
    payload.moistureRaw = moisture;
    payload.moistureMin = (int)MOISTURE_MIN;
    payload.moistureMax = (int)MOISTURE_MAX;
    payload.temperature = (int)(temperature * 100);
    payload.humidity = (int)(humidity * 100);
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
    debug.println("Trying to pair");
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
            radio.read(&ackPayload, sizeof(ackPayload));
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

                if (ackPayload.status && strlen(ackPayload.encryptionKey) == sizeof(ackPayload.encryptionKey) - 1) {
                    debug.println("Received encryption key, set paired state");
                    state = State::paired;
                    EEPROM.write(EEPROM_STATE_ADDRESS, (uint8_t)State::paired);
                    writeEncryptionKey(ackPayload.encryptionKey);

                    memset(&payload, 0, sizeof(payload));
                    payload.nodeId = NODE_ID;
                    payload.action = Action::confirmPairing;
                    char data[sizeof(payload)];
                    memcpy(data, &payload, sizeof(payload));
                    sendData(data, retries);
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

float readBatteryVoltageWithoutDivider() {
// Read 1.1V reference against AVcc
// set the reference to Vcc and the measurement to the internal 1.1V reference
#if defined(__AVR_ATmega32U4__) || defined(__AVR_ATmega1280__) || defined(__AVR_ATmega2560__)
    ADMUX = _BV(REFS0) | _BV(MUX4) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
#elif defined(__AVR_ATtiny24__) || defined(__AVR_ATtiny44__) || defined(__AVR_ATtiny84__)
    ADMUX = _BV(MUX5) | _BV(MUX0);
#elif defined(__AVR_ATtiny25__) || defined(__AVR_ATtiny45__) || defined(__AVR_ATtiny85__)
    ADMUX = _BV(MUX3) | _BV(MUX2);
#else
    ADMUX = _BV(REFS0) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
#endif

    delay(2);             // Wait for Vref to settle
    ADCSRA |= _BV(ADSC);  // Start conversion
    while (bit_is_set(ADCSRA, ADSC))
        ;  // measuring

    uint8_t low = ADCL;   // must read ADCL first - it then locks ADCH
    uint8_t high = ADCH;  // unlocks both

    long result = (high << 8) | low;

    result = 1125300L / result;  // Calculate Vcc (in mV); 1125300 = 1.1*1023*1000
    return result / 1000.0;      // Vcc in volts
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
    for (sleepCounter = 255; sleepCounter > 0; sleepCounter--) {
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

void initEncryptionKey() {
    uint8_t j = 0;
    for (uint8_t i = EEPROM_EK_ADDRESS; i < EEPROM_EK_ADDRESS + sizeof(encryptionKey); i++) {
        uint8_t val = EEPROM.read(i);
        encryptionKey[j] = (char)val;
        j++;
    }

    debug.print("Reading encryption key with length: ");
    debug.println(strlen(encryptionKey));
}

void writeEncryptionKey(char* key) {
    debug.print("Writing: ");
    debug.println(key);
    uint8_t j = 0;
    for (uint8_t i = EEPROM_EK_ADDRESS; i < EEPROM_EK_ADDRESS + sizeof(encryptionKey); i++) {
        EEPROM.write(i, key[j]);
        j++;
    }
    memcpy(encryptionKey, key, sizeof(encryptionKey));
}

void factoryReset() {
    EEPROM.write(EEPROM_STATE_ADDRESS, (uint8_t)State::unpaired);
    memset(&encryptionKey, 0, sizeof(encryptionKey));
    writeEncryptionKey(encryptionKey);
}

void flashLeds() {
    for (uint8_t i = 0; i < 4; i++) {
        digitalWrite(PD5, HIGH);
        digitalWrite(PD6, HIGH);
        delay(500);
        digitalWrite(PD5, LOW);
        digitalWrite(PD6, LOW);
        delay(500);
    }
}
