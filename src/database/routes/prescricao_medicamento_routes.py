from flask import request, Blueprint
from fastapi import HTTPException
from ..db_conexao import engine, Base, get_db, SessionLocal
from ..models.logs import Logs
from datetime import datetime

prescricao_medicamento_routes = Blueprint('prescricao_medicamento', __name__, url_prefix="/prescricao_medicamento")
def create pr

@prescricao_medicamento_routes.route("/create", methods=["POST"])

@prescricao_medicamento_routes.route("/update", methods=["PUT"])

@prescricao_medicamento_routes.route("/delete", methods=["DELETE"])

@prescricao_medicamento_routes.route("/read-all", methods=["GET", "POST"])

@prescricao_medicamento_routes.route("/read_id", methods=["POST"])