# utils/device_initializer.py
import os
import time
from SerialPortFinder.SerialPortFinder import SerialPortFinder
from DobotAutoDetector.DobotAutoDetector import DobotAutoDetector
from DobotConnectionHandler.DobotConnectionHandler import DobotConnectionHandler
import requests

DATABASE_URL = "http://127.0.0.1:3000"


def inicializar_dispositivos(app):
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true' and app.debug:
        return None

    print("\n=== INICIALIZAÇÃO DE DISPOSITIVOS ===")
    
    try:
        ports = SerialPortFinder.find_available_ports()
        port = DobotAutoDetector.detect(ports)
        connection_handler = DobotConnectionHandler()
        connection_handler.connect(port)
        connection_handler.initialize_robot()
        
        # Armazena no contexto da aplicação
        app.config['DOBOT'] = connection_handler.robot
        app.logger.info("Dobot inicializado com sucesso")
        
        data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": "Dispositivos inicializados.",
        "status": "SUCCESS"
        }
        requests.post(f"{DATABASE_URL}/logs/create", json=data)
        
        return connection_handler.robot
    except Exception as e:
        app.logger.error(f"Erro na inicialização do Dobot: {str(e)}")
        raise
    
