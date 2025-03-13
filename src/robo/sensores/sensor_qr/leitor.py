import serial
import logging
import time
from robo.base_scanner.configuracoes import SERIAL_PORT, SERIAL_BAUDRATE
from robo.sensores.sensor_qr.comandos import CONFIG_SEQUENCE, TRIGGER_SCAN, STOP_SCAN

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