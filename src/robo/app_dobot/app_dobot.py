from flask import Flask
from flask_mqtt import Mqtt
from .routes.dobot import dobot_bp
from .routes.fita import fita_bp
from .functions.device_initializer import inicializar_dispositivos
import json
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

app = Flask(__name__)

# Configurações MQTT
app.config.update({
    'MQTT_BROKER_URL': 'localhost',
    'MQTT_BROKER_PORT': 1883,
    'MQTT_KEEPALIVE': 5
})

mqtt = Mqtt(app)
app.mqtt = mqtt 

def check_dobot_connection():
    """Verificação ultra-rápida da conexão"""
    try:
        dobot = app.config.get('DOBOT')
        return "conectado" if dobot.pose() else "desconectado"
    except Exception:
        return "desconectado"

def publish_dobot_status():
    """Publicação de status com garantia de execução contínua"""
    try:
        status = check_dobot_connection()
        
        app.mqtt.publish(
            'dobot/status',
            json.dumps({
                "status": status,
                "timestamp": datetime.now().isoformat()
            }),
            retain=True
        )
    except Exception as e:
        pass  # Evita qualquer interrupção no scheduler

# Registrar Blueprints
app.register_blueprint(dobot_bp, url_prefix='/dobot')
app.register_blueprint(fita_bp, url_prefix='/dobot/fita')

# Configuração do Scheduler
with app.app_context(): 
    try:
        inicializar_dispositivos(app)
    except Exception as e:
        app.config['DOBOT'] = None
    
    scheduler = BackgroundScheduler(
        job_defaults={
            'max_instances': 5,  # Amplamente aumentado
            'misfire_grace_time': 60  # Tempo máximo de atraso
        }
    )
    scheduler.add_job(
        publish_dobot_status,
        'interval',
        seconds=1,
        id='dobot_heartbeat',
        coalesce=False  # Permite execuções paralelas
    )
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)