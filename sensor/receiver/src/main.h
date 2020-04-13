#define SERIAL_BAUD 115200
#define EEPROM_ADDRESS 0
#define DEBUG true

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
} debug;

void receiveData();
void sendDiscoverRequest();
void clearDiscoverRequestData();
void sendReadingData();
void formatData(uint8_t signal);
void initAccessKey();
void writeAccessKey(char* key);
void printPayload();
void printBytes();