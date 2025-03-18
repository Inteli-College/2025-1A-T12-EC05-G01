from flask import request, Blueprint
from fastapi import HTTPException
from ..db_conexao import engine, Base, get_db, SessionLocal
from ..models.logs import Logs
from datetime import datetime

perdas_routes = Blueprint('perdas', __name__, url_prefix="/perdas")
def create pr

@perdas_routes.route("/create", methods=["POST"])

@perdas_routes.route("/update", methods=["PUT"])

@perdas_routes.route("/delete", methods=["DELETE"])

@perdas_routes.route("/read-all", methods=["GET", "POST"])

@perdas_routes.route("/read_id", methods=["POST"])