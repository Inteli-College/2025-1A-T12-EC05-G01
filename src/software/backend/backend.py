from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
import os
from .routes.data.logs_routes import logs_routes
from .routes.data.estoque_routes import estoque_routes
from .routes.data.farmaceutico_routes import farmaceutico_routes
from .routes.data.medicamento_routes import medicamento_routes
from .routes.data.medicos_routes import medicos_routes
from .routes.data.paciente_routes import paciente_routes
from .routes.data.prescricao_on_hold_routes import prescricao_on_hold_routes
from .routes.data.prescricao_medicamento_routes import prescricao_medicamento_routes
from .routes.data.prescricao_aceita_routes import prescricao_aceita_routes
from .routes.data.saidas_routes import saida_routes
from .routes.authentication.authentication_routes import authentication_routes
from .routes.data.prescricao_aceita_routes import prescricao_aceita_routes
from .routes.data.fitas_routes import fitas_routes
from software.backend.config import Config 
from dotenv import load_dotenv

load_dotenv()
BACKEND_PORT = os.getenv("BACKEND_PORT")

backend_app = Flask(__name__)

backend_app.config.from_object(Config)

backend_app.secret_key = os.getenv('SECRET_KEY')

# Configure CORS with more permissive settings
CORS(backend_app, 
    resources={r"/*": {"origins": "*"}},  # Allow requests from any origin
    supports_credentials=True,            # Allow cookies to be sent with requests
    methods=["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],  # Allow all HTTP methods
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"]  # Allow common headers
)

# Register all blueprints
backend_app.register_blueprint(logs_routes)
backend_app.register_blueprint(estoque_routes)
backend_app.register_blueprint(farmaceutico_routes)
backend_app.register_blueprint(medicamento_routes)
backend_app.register_blueprint(medicos_routes)
backend_app.register_blueprint(paciente_routes)
backend_app.register_blueprint(authentication_routes)
backend_app.register_blueprint(prescricao_aceita_routes)
backend_app.register_blueprint(prescricao_on_hold_routes)
backend_app.register_blueprint(prescricao_medicamento_routes)
backend_app.register_blueprint(saida_routes)
backend_app.register_blueprint(fitas_routes)

# Add an options route handler for handling preflight requests
@backend_app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@backend_app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    response = backend_app.make_default_options_response()
    return response

if __name__ == "__main__":
    backend_app.run(host="0.0.0.0", port=BACKEND_PORT, debug=True)


