#define SERIAL_BAUD 115200
#define EEPROM_ADDRESS 0
#define DEBUG true



struct AckPayload {
    uint16_t nodeId;
    uint8_t status;
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

void receiveData();
void sendDiscoverRequest(uint16_t nodeId);
void sendPairingConfirmedRequest(char* newKey);
void clearResponseData();
void sendReadingData();
void formatData(uint8_t signal);
void initAccessKey();
void writeAccessKey(char* key);
void printPayload();
void printBytes();
bool isSensorPaired(uint16_t sensorNodeId);
