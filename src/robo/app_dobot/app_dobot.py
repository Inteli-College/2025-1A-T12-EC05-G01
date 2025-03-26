from flask import Flask
from flask_mqtt import Mqtt
from .routes.dobot import dobot_bp
from .routes.fita import fita_bp
from .routes.bin import bin_bp
from .functions.device_initializer import inicializar_dispositivos
import json
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import os
from .MQTT_config import MQTT_CONFIG
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configurações MQTT
app.config.update(MQTT_CONFIG)
mqtt = Mqtt(app)
app.mqtt = mqtt 

def check_dobot_connection():
    """Verificação otimizada da conexão"""
    try:
        # Primeiro verifica se a porta serial ainda existe
        dobot_port = app.config.get('DOBOT_PORT')
        if not dobot_port or not os.path.exists(dobot_port):
            app.config['DOBOT'] = None
            return "desconectado"
            
        # Depois verifica a comunicação com o robô
        dobot = app.config.get('DOBOT')
        if dobot and dobot.pose():
            app.config['DOBOT'] = dobot
            return "conectado"
        app.config['DOBOT'] = None
        return "desconectado"
    except Exception:
        app.config['DOBOT'] = None
        return "desconectado"

def publish_dobot_status():
    try:
        # Verificação otimizada
        port = app.config.get('DOBOT_PORT')
        if not port or not os.path.exists(port):
            status = "desconectado"
            app.config['DOBOT'] = None
        else:
            dobot = app.config.get('DOBOT')
            status = "conectado" if dobot and dobot.pose() else "desconectado"
            
        app.mqtt.publish(
            'dobot/status',
            json.dumps({
                "status": status,
                "timestamp": datetime.now().isoformat()
            }),
            retain=True
        )
    except Exception as e:
        pass

# Registrar Blueprints
app.register_blueprint(dobot_bp, url_prefix='/dobot')
app.register_blueprint(fita_bp, url_prefix='/dobot/fita')
app.register_blueprint(bin_bp, url_prefix='/dobot/bin')

# Configuração do Scheduler
with app.app_context(): 
    try:
        inicializar_dispositivos(app)
    except Exception as e:
        app.config['DOBOT'] = None
    
    scheduler = BackgroundScheduler(
    job_defaults={
        'max_instances': 1,  # Permite apenas 1 instância simultânea
        'misfire_grace_time': 3  # Tempo igual ao intervalo
        }
    )
    scheduler.add_job(
        publish_dobot_status,
        'interval',
        seconds=3,  # Intervalo aumentado para 3 segundos
        id='dobot_heartbeat',
        coalesce=True  # Agrupa execuções pendentes
    )
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)