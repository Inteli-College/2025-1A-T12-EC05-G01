## Para I2C
import smbus
import time
import logging

class SensorInfravermelho:
    def __init__(self, endereco_escravo=8, barramento=1, limite_deteccao=600):
        """
        Inicializa o sensor infravermelho
        :param endereco_escravo: Endereço I2C do Arduino (padrão: 8)
        :param barramento: Número do barramento I2C (padrão: 1 para raspberry pi 5)
        :param limite_deteccao: Valor limite para detecção de objeto (padrão: 600)
        ## TODO: Colocar esse treshold num env
        """
        self.endereco_escravo = endereco_escravo
        self.limite_deteccao = limite_deteccao
        self.bus = smbus.SMBus(barramento)
        self.logger = logging.getLogger(__name__)
        
    def ler_sensor(self):
        """
        Lê e retorna o valor atual do sensor
        :return: Valor do sensor ou None em caso de erro
        """
        try:
            data = self.bus.read_i2c_block_data(self.endereco_escravo, 0, 2)
            return (data[0] << 8) | data[1]
        except Exception as e:
            self.logger.error(f"Erro na leitura do sensor: {str(e)}")
            return None
            
    def verificar_objeto_detectado(self):
        """
        Verifica se há um objeto detectado com base no limite configurado
        :return: True se objeto detectado, False caso contrário ou em caso de erro
        """
        valor = self.ler_sensor()
        if valor is None:
            return False
        return valor > self.limite_deteccao

    def __repr__(self):
        return f"SensorInfravermelho(endereco={self.endereco_escravo}, limite={self.limite_deteccao})"