---
title: Leitor de QR Code
sidebar_position: 2
slug: /leitor-qrcode
---

import useBaseUrl from '@docusaurus/useBaseUrl';

&emsp;O processo automatizado de montagem das fitas de medicamentos demandou soluções precisas para garantir a rastreabilidade dos itens manipulados pelo robô. Para resolver essa questão, foi integrado ao projeto o módulo de leitura de QR Code MH-ET Live Scanner V3.0. Esse módulo foi selecionado devido à sua capacidade robusta de reconhecimento rápido e confiável tanto de códigos QR quanto de códigos de barras, essencial para garantir a correta identificação dos medicamentos durante o processo.

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 2 - Leitor MH-ET Live Scanner V3.0</strong></p>
  <img 
    src={useBaseUrl('/img/leitor_qrcode.png')} 
    alt="Leitor QR Code MH-ET Live Scanner V3.0" 
    title="Leitor QR Code MH-ET Live Scanner V3.0" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: [WJ Componentes Eletrônicos](https://www.wjcomponentes.com.br/sensores/diversos/modulo-leitor-de-codigo-de-barras-e-qr-code-mh-et-live-scanner-v3-0)</p>
</div>

## Funcionamento e Configuração

&emsp;O leitor MH-ET Live Scanner V3.0 utiliza comunicação serial com protocolo UART através de interface TTL de 3.3V, padrão compatível diretamente com o Raspberry Pi utilizado no projeto. O módulo oferece diversos modos de leitura, incluindo modo contínuo, modo por indução e modo por comandos. <br />
&emsp;Para configuração inicial, o leitor utiliza uma série de comandos enviados através da porta serial. Esses comandos são necessários para ativar o modo desejado de operação e definir parâmetros específicos de leitura. A configuração padrão escolhida foi o modo contínuo, em que o leitor realiza a leitura automaticamente em intervalos definidos. <br />
&emsp;Os comandos configurados no dispositivo foram definidos no arquivo `comandos.py` como mostrado a seguir:

```python
CONFIG_MODE_ON = "~M00910001."      # Ativa o modo de configuração
OUTPUT_MODE = "~M00510000."         # Define o formato de saída dos dados
CONTINUOUS_MODE = "~M00210001."     # Ativa o modo de leitura contínua
SET_DELAY = "~M00B0000F."           # Intervalo personalizado de leitura (~1.45s)
SAVE_CONFIG = "~MA5F0506A."         # Salva a configuração no dispositivo
CONFIG_MODE_OFF = "~M00910000."     # Desativa o modo de configuração

CONFIG_SEQUENCE = [
    CONFIG_MODE_ON,
    OUTPUT_MODE,
    CONTINUOUS_MODE,
    SET_DELAY,
    SAVE_CONFIG,
    CONFIG_MODE_OFF,
]

TRIGGER_SCAN = "SCAN\n"  
STOP_SCAN = "STOP\n"
STATUS_CHECK = "STATUS\n"
```

## Intervalo Personalizado de Leitura
&emsp;Um aspecto interessante observado durante o desenvolvimento foi relacionado ao intervalo entre leituras. A documentação oficial do leitor fornece apenas quatro opções padrões para intervalos entre leituras: contínuo (tempo todo), 100ms, 1s e 10s. Porém, durante testes, foi percebido que esses intervalos seguiam um padrão hexadecimal para definição dos comandos. <br />
&emsp;Explorando essa hipótese, mesmo sem documentação oficial confirmando essa possibilidade, definimos um intervalo customizado de aproximadamente 1,45 segundos utilizando o comando hexadecimal ```~M00B0000F```. O resultado foi satisfatório, mostrando a flexibilidade do módulo para configurações personalizadas. 
&emsp;A personalização dos intervalos utilizando valores hexadecimais permitiu uma melhor adequação do tempo entre as leituras às necessidades específicas do projeto.

## Código para Uso do Leitor
Para realizar a leitura e captura do conteúdo de QR codes através do Raspberry Pi, foi criada a classe SerialDevice no arquivo leitor.py, que estabelece conexão e permite o envio dos comandos de configuração e escaneamento, como visto abaixo:

```python
import serial
import logging
import time
from base_scanner.configuracoes import SERIAL_PORT, SERIAL_BAUDRATE
from sensores.sensor_qr.comandos import CONFIG_SEQUENCE, TRIGGER_SCAN, STOP_SCAN

logger = logging.getLogger(__name__)

class SerialDevice:    
    def __init__(self, port=SERIAL_PORT, baudrate=SERIAL_BAUDRATE):
        self.port = port
        self.baudrate = baudrate
        self.serial = None
        self._connect()
    
    def _connect(self):
        try:
            self.serial = serial.Serial(
                port=self.port,
                baudrate=self.baudrate,
                timeout=1
            )
            logger.info(f"Conectado ao dispositivo serial na porta {self.port}")
        except Exception as e:
            logger.error(f"Erro ao conectar ao dispositivo serial: {e}")
            raise
    
    def send_command(self, command):
        if not self.serial or not self.serial.is_open:
            self._connect()
        
        try:
            self.serial.write(command.encode())
            time.sleep(0.2) 
            response = self.serial.readline().decode().strip()
            return response
        except Exception as e:
            logger.error(f"Erro ao enviar comando: {e}")
            return f"ERROR: {str(e)}"
    
    def read_data(self):
        if not self.serial or not self.serial.is_open:
            self._connect()
            
        if self.serial.in_waiting > 0:
            return self.serial.readline().decode().strip()
        return None
    
    def configure_device(self):
        for command in CONFIG_SEQUENCE:
            response = self.send_command(command)
            logger.debug(f"Comando: {command} - Resposta: {response}")
        
        logger.info("Configuração do dispositivo concluída")
    
    def close(self):
        if self.serial and self.serial.is_open:
            self.serial.close()
            logger.info("Conexão serial fechada")
    
    def read_qr_code(self):
        data = self.read_data()
        if data:
            logger.info(f"QR Code lido: {data}")
            return {
                "content": data,
                "timestamp": time.time()
            }
        return None
    
    def start_scanning(self):
        response = self.send_command(TRIGGER_SCAN)
        logger.info(f"Iniciando escaneamento. Resposta: {response}")
        return response
    
    def stop_scanning(self):
        response = self.send_command(STOP_SCAN)
        logger.info(f"Parando escaneamento. Resposta: {response}")
        return response
```

Esse código é utilizado no fluxo principal do robô para identificar os medicamentos antes da coleta, garantindo que cada item seja corretamente rastreado durante todo o processo automatizado.

A seguir está um exemplo da utilização do leitor no fluxo de operação dentro do arquivo executar_rotina.py:

```python
qr_reader = SerialDevice(port=SERIAL_PORT, baudrate=SERIAL_BAUDRATE)
qr_reader.start_scanning()

qr_detectado = False
while not qr_detectado:
    data = qr_reader.read_qr_code()
    if data:
        print("\n=== QR CODE DETECTADO ===")
        print(f"Conteúdo: {data['content']}")
        print(f"Timestamp: {data['timestamp']}")
        print("========================")
        qr_detectado = True

qr_reader.stop_scanning()
qr_reader.close()
```

Essa abordagem garante que o sistema tenha certeza absoluta sobre qual medicamento está sendo manipulado, evitando erros e contribuindo diretamente para a segurança e eficácia do processo automatizado.

:::tip
Na seção de Hardware, é possível visualizar o leitor de QR Code em operação, ilustrando a implementação prática mencionada aqui.
:::