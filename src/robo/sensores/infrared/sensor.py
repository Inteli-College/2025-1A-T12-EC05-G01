import serial
import logging
import time
from src.robo.scanner_config.settings import IR_SERIAL_PORT, IR_SERIAL_BAUDRATE, IR_THRESHOLD

logger = logging.getLogger(__name__)

class InfraredSensor:
    def __init__(self, port=IR_SERIAL_PORT, baudrate=IR_SERIAL_BAUDRATE, threshold=IR_THRESHOLD):
        self.port = port
        self.baudrate = baudrate
        self.threshold = threshold
        self.serial = None
    
    def start_sensor(self):
        try:
            self.serial = serial.Serial(
                port=self.port,
                baudrate=self.baudrate,
                timeout=1
            )
            logger.info(f"Conectado ao sensor infravermelho na porta {self.port}")
        except Exception as e:
            logger.error(f"Erro ao conectar ao sensor infravermelho: {e}")
            raise
    
    def read_sensor(self):
        if not self.serial or not self.serial.is_open:
            self.start_sensor()
            
        try:
            if self.serial.in_waiting > 0:
                raw_data = self.serial.readline().decode().strip()
                try:
                    raw_value = int(raw_data)
                    is_detecting = raw_value > self.threshold
                    return {
                        "raw_value": raw_value,
                        "is_detecting": is_detecting,
                        "timestamp": time.time()
                    }
                except ValueError:
                    logger.error(f"Dados inválidos do sensor: {raw_data}")
            return None
        except Exception as e:
            logger.error(f"Erro ao ler do sensor infravermelho: {e}")
            return None
    
    def close(self):
        if self.serial and self.serial.is_open:
            self.serial.close()
            logger.info("Conexão do sensor infravermelho fechada")
