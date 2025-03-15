---
title: Sensor infravermelho
sidebar_position: 1
slug: /sensor-infravermelho
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Como uma das principais dores do parceiro quanto ao processo atual de montagem de fita de medicamentos é a possibilidade de haver erros como a falta de um medicamento ser coletado, foi pensado em uma forma para evitar que problemas semelhantes ocorram com o robô. Nesse contexto, como o robô não possui um sistema embutido para identificar se algo está sendo coletado por ele na ventosa, foi necessário a integração com um sensor de infravermelho para assegurar essa verificação. Dessa maneira, através da integração do sensor infravermelhor TCRT5000 com o sistema, foi possível programar no código um modo de checagem para garantir que o medicamento foi coletado.

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - Sensor TCRT5000</strong></p>
  <img 
    src={useBaseUrl('/img/sensor_tcrt5000.png')} 
    alt="Suporte sensores" 
    title="Suporte sensores" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: [Link para a imagem](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.huinfinito.com.br%2Fhome%2F1040-sensor-optico-reflexivo-ir-tcrt5000.html&psig=AOvVaw3tFHpQ_z5UvI_QTfcGl3sW&ust=1742136303200000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCIwc2pjIwDFQAAAAAdAAAAABAE)</p>
</div>

Para isso ser possível, o sensor TCRT precisou ser conectado em um Arduíno NANO, que por sua vez foi conectado ao Raspberry Pi por via I2C. A seguir, será possível visualizar o código de leitura e envio de dados do infravermelho no arduíno:

```c++
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
```

Já o código a seguir é em python, utilizado para receber o valor que vem do arduíno e permitir a mostrar esse valor no terminal:

```python
import smbus
import time
SLAVE_ADDRESS = 8
bus = smbus.SMBus(1)    # Utiliza o barramento I2C 1 (padrão no Raspberry Pi)
time.sleep(1)
while True:
    try:
        # Lê 2 bytes do slave; o comando (primeiro parâmetro após o endereço) pode ser 0
        data = bus.read_i2c_block_data(SLAVE_ADDRESS, 0, 2)
        sensor_value = (data[0] << 8) | data[1]
        print("Valor do sensor:", sensor_value)
    except Exception as e:
        print("Erro na comunicação I2C:", e)
    
```

A partir do recebimento da leitura constante dos valores do sensor infravermelho, foi possível fazer lógicas no código que se adequassem com as regras de negócios da farmácia do HC, de modo que através do código a seguir, será possível ver se o robô falhar ao tentar coletar um medicamento, ele irá reiniciar e tentar executar a ação novamente, o que irá impossibilitar uma fita de medicamentos ser montada com a ausência de algum remédio. Como o sensor possui um fototransistor embutido, ele identifica se o medicamento foi coletado ou não de acordo com a luminosidade, se a luminosidade ficar acima de 600, significará que há muito brilho sendo recebido pelo sensor, o que indica que o medicamento não foi coletado.

```python
if pontos_medicamento['suctionCup'].lower() == 'on':
            robo.suck(True)            
            
            try:
                data = bus.read_i2c_block_data(SLAVE_ADDRESS, 0, 2)
                sensor_value = (data[0] << 8) | data[1]
                print(f"Valor do sensor: {sensor_value}")
                
                if sensor_value > 600:
                    logger.warning("Falha na pega do medicamento. Reiniciando rotina...")
                    robo.movel_to(x, y, 143.0, r, wait=True)
                    return executar_rotina_medicamento(
                        robo, medicamento, medicamentos,
                        delta_z=0, tentativas=tentativas+1, max_tentativas=max_tentativas
                    )
                    
            except Exception as e:
                logger.error(f"Erro na leitura do sensor: {e}")
                return False
                
        else:
            robo.suck(False)
```

:::tip
Na seção de Hardware, é possível ver o sensor infravermelho sendo utilizado para mostrar o uso das funcionalidades citadas nesta seção
:::