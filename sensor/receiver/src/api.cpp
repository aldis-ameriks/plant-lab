#include <api.h>

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};

void ApiClient::init(char key[25]) {
    delay(1000);
    Ethernet.begin(mac);
    Serial.print("My IP address: ");
    Serial.println(Ethernet.localIP());
    memcpy(accessKey, key, sizeof(accessKey));
}

void ApiClient::parseResponse() {
    if (client.available()) {
        char c = client.read();

        if (c == 0x0A) {
            newLines++;
        }

        if (newLines == 6 && c != 0x0A) {
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
        Serial.print("Sending discover request - ");
        Serial.println(nodeId);

        client.println("POST /discover HTTP/1.1");
        client.print("Host: ");
        client.println(server);
        client.println("User-Agent: arduino-ethernet");
        client.println("Content-Type: text/plain");
        client.println("Connection: close");
        client.print("Content-Length: ");
        client.println(sizeof(nodeId));
        client.println();
        client.println(nodeId);

    } else {
        Serial.println("Connection failed");
    }
}

void ApiClient::sendReadingData(char postData[80]) {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        Serial.println("Sending request");
        Serial.println(postData);

        client.println("POST /reading HTTP/1.1");
        client.print("Host:");
        client.println(server);
        client.println("User-Agent: arduino-ethernet");
        client.print("access-key: ");
        client.println(accessKey);
        client.println("Content-Type: text/plain");
        client.println("Connection: close");
        client.print("Content-Length: ");
        client.println(strlen(postData));
        client.println();
        client.println(postData);
    } else {
        Serial.println("Connection failed");
    }
}

void ApiClient::sendPairingConfirmedRequest(uint16_t nodeId, char* newKey) {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, port)) {
        Serial.print("Sending pairing confirmed request - ");
        Serial.println(nodeId);

        client.println("POST /confirm-pairing HTTP/1.1");
        client.print("Host: ");
        client.println(server);
        client.println("User-Agent: arduino-ethernet");
        client.print("access-key: ");
        client.println(newKey);
        client.println("Content-Type: text/plain");
        client.println("Connection: close");
        client.print("Content-Length: ");
        client.println(sizeof(nodeId));
        client.println();
        client.println(nodeId);

    } else {
        Serial.println("Connection failed");
    }
}