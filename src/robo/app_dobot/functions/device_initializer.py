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
            old_dobot = app.config.get('DOBOT')

            # Sempre desconectar qualquer instância anterior antes de criar nova conexão
            if old_dobot:
                safe_disconnect(old_dobot)
                app.config['DOBOT'] = None

            # Detecção e inicialização do Dobot
            ports = SerialPortFinder.find_available_ports()
            port = DobotAutoDetector.detect(ports)
            app.config['DOBOT_PORT'] = port

            handler = DobotConnectionHandler()
            handler.connect(port)
            handler.initialize_robot()

            # Armazenar nova instância do robô
            app.config['DOBOT'] = handler.robot

            app.logger.info("Dobot inicializado com sucesso")
            return handler.robot
        except Exception as e:
            app.config['DOBOT'] = None
            app.config['DOBOT_PORT'] = None
            app.logger.error(f"Falha na inicialização: {str(e)}")
            raise

    return None

def safe_disconnect(robot):
    """Desconexão segura do Dobot"""
    try:
        if robot:
            robot.close()
    except Exception as e:
        pass