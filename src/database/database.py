from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS  # Importe o Flask-CORS
from .routes.logs_routes import logs_routes
from .routes.estoque_routes import estoque_routes
from .routes.farmaceutico_routes import farmaceutico_routes
from .routes.medicamento_routes import medicamento_routes
from .routes.medicos_routes import medicos_routes
from .routes.paciente_routes import paciente_routes

database_app = Flask(__name__)
CORS(database_app, origins=["http://localhost:5173"])  # Habilita o CORS para o domínio do seu frontend

database_app.register_blueprint(logs_routes)
database_app.register_blueprint(estoque_routes)
database_app.register_blueprint(farmaceutico_routes)
database_app.register_blueprint(medicamento_routes)
database_app.register_blueprint(medicos_routes)
database_app.register_blueprint(paciente_routes)

if __name__ == "__main__":
    database_app.run(host="0.0.0.0", port=3000, debug=True)
