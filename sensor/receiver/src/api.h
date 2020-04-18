#include <Arduino.h>
#include <Ethernet.h>

const char server[] = "192.168.0.102";
const uint16_t port = 4000;

class ApiClient {
    char accessKey[25];
    uint8_t newLines = 0;
    uint8_t responseCursor = 0;

public:
    void init(char accessKey[25]);
    void sendDiscoverRequest(uint16_t nodeId);
    void sendPairingConfirmedRequest(uint16_t nodeId, char* newKey);
    void clearResponseData();
    void sendReadingData(char postData[80]);
    void parseResponse();
    EthernetClient client;
    char response[25];
};