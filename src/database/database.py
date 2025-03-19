from flask import Flask, jsonify, request, Blueprint
from database.routes.logs_routes import logs_routes

database_app = Flask(__name__)

database_app.register_blueprint(logs_routes)

if __name__ == "__main__":
    database_app.run(host="0.0.0.0", port=3000, debug=True)
