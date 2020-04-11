#define SERIAL_BAUD 115200

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

void receiveData();
void sendHttpRequestWithData();
void formatData(uint8_t signal);
void printPayload();
void printRawBytes();