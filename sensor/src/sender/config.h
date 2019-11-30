#define SERIAL_BAUD 115200

#define NETWORKID   100
#define GATEWAYID   1
#define FREQUENCY     RF69_433MHZ
#define ENCRYPTKEY    RADIO_ENCRYPTION_KEY
//#define IS_RFM69HW_HCW  //uncomment only for RFM69HW/HCW! Leave out if you have RFM69W/CW!
#define REQUEST_ACK true
#define ACK_TIME 50
#define DELAY_BEFORE_SLEEP (long)1000
//*********************************************************************************************
//Auto Transmission Control - dials down transmit power to save battery
//Usually you do not need to always transmit at max output power
//By reducing TX power even a little you save a significant amount of battery power
//This setting enables this gateway to work with remote nodes that have ATC enabled to
//dial their power down to only the required level
#define ENABLE_ATC    //comment out this line to disable AUTO TRANSMISSION CONTROL
//*********************************************************************************************

#ifdef ENABLE_ATC
  RFM69_ATC radio;
#else
  RFM69 radio;
#endif

#define REGULATOR_V 3.31
#define SEND_DATA true
#define SLEEP true

// For measuring battery voltage
#define R1 10000000.0 // R1 (10M)
#define R2 1000000.0  // R2 (1M)

// TODO: Come up with more sustainable configuration management
#if SENSOR_ID == 5
  #define WITH_REGULATOR
  #define MOISTURE_MIN 807
  #define MOISTURE_MAX 407
  #define TEMPERATURE_OFFSET 0.4809
  #define INTERNAL_AREF 1.1
#endif

#if SENSOR_ID == 6
  #define WITH_REGULATOR
  #define MOISTURE_MIN 848
  #define MOISTURE_MAX 431
  #define TEMPERATURE_OFFSET 0.4773
  #define INTERNAL_AREF 1.1
#endif

#if SENSOR_ID == 7
  #define MOISTURE_MIN 806
  #define MOISTURE_MAX 407
  #define TEMPERATURE_OFFSET 0.4856
  #define INTERNAL_AREF 1.1
  #undef R2
  #define R2 1011594.0
#endif

