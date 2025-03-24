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

            # Se for um novo processo, evitar usar a conexão antiga
            if old_dobot and current_process().pid != old_dobot.pid:
                safe_disconnect(old_dobot)
                app.config['DOBOT'] = None  

            ports = SerialPortFinder.find_available_ports()
            port = DobotAutoDetector.detect(ports)
            app.config['DOBOT_PORT'] = port

            handler = DobotConnectionHandler()
            handler.connect(port)
            handler.initialize_robot()

            # Guardar o PID do processo atual para evitar reuso incorreto
            handler.robot.pid = current_process().pid
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
    """Desconexão segura, evitando erros em threads."""
    try:
        if robot:
            robot.close()
            del robot  # Forçar remoção do objeto da memória
    except Exception as e:
        pass