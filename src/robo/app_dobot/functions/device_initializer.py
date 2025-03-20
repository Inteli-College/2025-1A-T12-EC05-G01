import os
from SerialPortFinder.SerialPortFinder import SerialPortFinder
from DobotAutoDetector.DobotAutoDetector import DobotAutoDetector
from DobotConnectionHandler.DobotConnectionHandler import DobotConnectionHandler
import json
from datetime import datetime

DATABASE_URL = "http://127.0.0.1:3000"

def inicializar_dispositivos(app):
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true' or not app.debug:
        print("\n=== INICIALIZAÇÃO DE DISPOSITIVOS ===")
        
        try:
            # Busca portas sem threads
            ports = SerialPortFinder.find_available_ports()
            port = DobotAutoDetector.detect(ports)
            
            # Conexão direta
            handler = DobotConnectionHandler()
            handler.connect(port)
            handler.initialize_robot()
            
            app.config['DOBOT'] = handler.robot
            app.logger.info("Dobot inicializado com sucesso")
            
            return handler.robot
            
        except Exception as e:
            app.config['DOBOT'] = None
            app.logger.error(f"Falha na inicialização: {str(e)}")
            raise
    
    return None