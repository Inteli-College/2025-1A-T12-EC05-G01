from flask import Flask
from flask_cors import CORS
from .routes.dobot import dobot_bp
from .routes.fita import fita_bp
from .functions.device_initializer import inicializar_dispositivos

app = Flask(__name__)

# Habilitar CORS para todas as URLs
CORS(app)

# Registrar Blueprints
app.register_blueprint(dobot_bp, url_prefix='/dobot')
app.register_blueprint(fita_bp, url_prefix='/dobot/fita')

# Inicialização de dispositivos
inicializar_dispositivos(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
