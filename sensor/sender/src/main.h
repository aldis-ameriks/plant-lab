#define SERIAL_BAUD 115200

#define DELAY_BEFORE_SLEEP (long)1000
#define REGULATOR_V 3.31
#define SEND_DATA true
#define SLEEP true
#define DEBUG true
#define EEPROM_ADDRESS 0

// For measuring battery voltage
#define R1 10000000.0  // R1 (10M)
#define R2 1000000.0   // R2 (1M)
#define INTERNAL_AREF 1.1

enum class Action { send, pairing };

enum class State { unpaired, paired };

// Maximum payload size is 32 bytes
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
    Action action;
};

struct AckPayload {
    uint16_t nodeId;
    bool status;
    char encryptionKey[25];
};

class Debug : public Print {
public:
    Debug() : debug(DEBUG) {}
    virtual size_t write(uint8_t c) {
        if (debug) {
            Serial.write(c);
        }
        return 1;
    }
    bool debug;
};

float readBatteryVoltage();
float readTemperature();
int readLight();
int readMoisture();
void enterSleep();
void initLightSensor();
void initSensors();
void printBytes(char* data);
void processPairing();
void processReadings();
void sendData(char* data, uint8_t retries = 0);
void sendSensorPairing();
