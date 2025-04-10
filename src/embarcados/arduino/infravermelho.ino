// Este código é um exemplo de como usar o Arduino como um slave I2C
// para enviar dados de um sensor de infravermelho (IR) para um dispositivo mestre.
// O código lê o valor do sensor de infravermelho conectado ao pino A3
// e envia os dados via I2C quando solicitado pelo mestre.
// O valor do sensor é dividido em dois bytes (alta e baixa ordem)
// para facilitar o envio via I2C.
// O endereço do slave I2C é definido como 8.

// No projeto, o Arduino lê o sensor infravermelho e o envia via I2C
// para o raspberry pi, que é o mestre I2C.

#include <Arduino.h>
#include <Wire.h>
#define SLAVE_ADDRESS 8   // Endereço slave do arduino em i2c
const int sensorPin = A3; // Pino do sensor
void setup() {
  Wire.begin(SLAVE_ADDRESS);
  Wire.onRequest(sendSensorData);
  Serial.begin(9600);
}
void loop() {
  delay(10);
}
void sendSensorData() {
  int sensorValue = analogRead(sensorPin);
  // Divide o valor em 2 bytes (alta e baixa ordem) para envio via i2c
  byte highByte = sensorValue >> 8;           // Parte alta
  byte lowByte = sensorValue & 0xFF;            // Parte baixa
  Wire.write(highByte);
  Wire.write(lowByte);
}