from flask import request, Blueprint
from fastapi import HTTPException
from ..db_conexao import engine, Base, get_db, SessionLocal
from ..models.logs import Logs
from datetime import datetime

prescricao_aceita_routes = Blueprint('prescricao_aceita', __name__, url_prefix="/prescricao_aceita")
def create pr

@prescricao_aceita_routes.route("/create", methods=["POST"])

@prescricao_aceita_routes.route("/update", methods=["PUT"])

@prescricao_aceita_routes.route("/delete", methods=["DELETE"])

@prescricao_aceita_routes.route("/read-all", methods=["GET", "POST"])

@prescricao_aceita_routes.route("/read_id", methods=["POST"])