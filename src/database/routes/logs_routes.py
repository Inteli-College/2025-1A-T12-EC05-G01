from flask import Flask, jsonify, request, Blueprint
from sqlalchemy.orm import Session
from ..db_conexao import engine, Base, get_db, SessionLocal
from ..models.logs import Logs
from datetime import datetime

logs_routes = Blueprint('logs', __name__)
@logs_routes.route('/logs')

@logs_routes.route("/logs/create", methods=["POST"])
def create_logs():
    db = SessionLocal()
    try:
        log = Logs(
            level=request.json.get("level"),
            origin=request.json.get("origin"),
            action=request.json.get("action"),
            description=request.json.get("description"),
            status=request.json.get("status"),
            log_data=datetime.now()
        )
        db.add(log)
        db.commit()
        return {"message": "Log saved in the database"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()