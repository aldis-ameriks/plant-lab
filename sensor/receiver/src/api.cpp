#include <api.h>

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};

void ApiClient::init(char key[25]) {
    delay(1000);
    Ethernet.begin(mac);
    Serial.print(F("My IP address: "));
    Serial.println(Ethernet.localIP());
    memcpy(accessKey, key, sizeof(accessKey));
}

void ApiClient::parseResponse() {
    if (client.available()) {
        char c = client.read();

        if (c == 0x0A) {
            if (newLines == 6) {
                response[responseCursor] = c;
            } else {
                newLines++;
            }
        }

        if (responseCursor >= sizeof(response)) {
            Serial.println(F("Response overflow"));
            Serial.println(response);
            client.stop();
            clearResponseData();
            return;
        }

        // Skip null terminate and carriage return
        if (newLines == 6 && c != 0x0A && c != 0xD) {
            response[responseCursor] = c;
            responseCursor++;
        }
    }
}

void ApiClient::clearResponseData() {
    memset(response, 0, sizeof(response));
    responseCursor = 0;
    newLines = 0;
}

void ApiClient::sendDiscoverRequest(uint16_t nodeId) {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        Serial.print(F("Sending discover request - "));
        Serial.println(nodeId);

        client.println(F("POST /discover HTTP/1.1"));
        client.print(F("Host: "));
        client.println(server);
        client.println(F("User-Agent: arduino-ethernet"));
        client.println(F("Content-Type: text/plain"));
        client.println(F("Connection: close"));
        client.print(F("Content-Length: "));
        client.println(sizeof(nodeId));
        client.println();
        client.println(nodeId);

    } else {
        Serial.println(F("Connection failed"));
    }
}

void ApiClient::sendReadingData(char postData[80]) {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        Serial.println(F("Sending request"));
        Serial.println(postData);

        client.println(F("POST /reading HTTP/1.1"));
        client.print(F("Host:"));
        client.println(server);
        client.println(F("User-Agent: arduino-ethernet"));
        client.print(F("access-key: "));
        client.println(accessKey);
        client.println(F("Content-Type: text/plain"));
        client.println(F("Connection: close"));
        client.print(F("Content-Length: "));
        client.println(strlen(postData));
        client.println();
        client.println(postData);
    } else {
        Serial.println(F("Connection failed"));
    }
}

void ApiClient::sendPairingConfirmedRequest(uint16_t nodeId, char* newKey) {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        Serial.print(F("Sending pairing confirmed request - "));
        Serial.println(nodeId);

        client.println(F("POST /confirm-pairing HTTP/1.1"));
        client.print(F("Host: "));
        client.println(server);
        client.println(F("User-Agent: arduino-ethernet"));
        client.print(F("access-key: "));
        client.println(newKey);
        client.println(F("Content-Type: text/plain"));
        client.println(F("Connection: close"));
        client.print(F("Content-Length: "));
        client.println(sizeof(nodeId));
        client.println();
        client.println(nodeId);

    } else {
        Serial.println(F("Connection failed"));
    }
}
