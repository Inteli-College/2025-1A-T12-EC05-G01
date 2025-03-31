from base_scanner.configuracoes import SCAN_INTERVAL
import sys
import serial.tools.list_ports
from base_scanner.configuracoes import SCAN_INTERVAL, SERIAL_PORT, SERIAL_BAUDRATE
from sensores.sensor_qr.leitor import SerialDevice
import serial
import logging
from typing import Optional, Dict
from app_dobot.functions.qr_code_ports import list_available_ports, select_port


class LeitorQRCode:
    def __init__(self, porta: str = None, baudrate: int = None):
        self.porta = porta or SERIAL_PORT
        self.baudrate = baudrate or SERIAL_BAUDRATE
        self.dispositivo: Optional[SerialDevice] = None
        self.logger = logging.getLogger(__name__)

    def __enter__(self):
        self.conectar()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.desconectar()

    def conectar(self) -> bool:
        """Estabelece conexão com o dispositivo de leitura QR Code"""
        try:
            self.dispositivo = SerialDevice(
                port=self.porta,
                baudrate=self.baudrate
            )
            self.logger.info(f"Conectado ao QR Code na porta {self.porta}")
            return True
        except Exception as e:
            self.logger.error(f"Falha na conexão com QR Code: {str(e)}")
            return False

    def iniciar_leitura(self) -> None:
        """Inicia o processo de escaneamento contínuo"""
        if self.dispositivo:
            self.dispositivo.start_scanning()
            self.logger.debug("Leitura QR Code iniciada")

    def parar_leitura(self) -> None:
        """Interrompe o processo de escaneamento"""
        if self.dispositivo:
            self.dispositivo.stop_scanning()
            self.logger.debug("Leitura QR Code interrompida")

    def ler_codigo(self) -> Optional[Dict]:
        """
        Tenta ler um código QR disponível
        Retorna um dicionário com conteúdo e timestamp ou None
        """
        if self.dispositivo:
            try:
                dados = self.dispositivo.read_qr_code()
                if dados:
                    self.logger.info("QR Code detectado")
                    return {
                        'conteudo': dados['content'],
                        'timestamp': dados['timestamp']
                    }
            except Exception as e:
                self.logger.error(f"Erro na leitura QR Code: {str(e)}")
        return None

    def desconectar(self) -> None:
        """Encerra a conexão com o dispositivo"""
        if self.dispositivo:
            try:
                self.dispositivo.close()
                self.logger.info("Conexão QR Code encerrada")
            except Exception as e:
                self.logger.error(f"Erro ao desconectar QR Code: {str(e)}")

    @staticmethod
    def listar_portas_disponiveis() -> list:
        """Retorna lista de portas seriais disponíveis"""
        return [porta.device for porta in comports()]