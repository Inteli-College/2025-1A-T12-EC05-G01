from flask import request, Blueprint
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.logs import Logs
from datetime import datetime

logs_routes = Blueprint('logs', __name__, url_prefix="/logs")

@logs_routes.route("/create", methods=["POST"])
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

@logs_routes.route("/delete", methods=["DELETE"])
def delete_logs():
    db = SessionLocal()
    try:
        log_id = request.args.get("id")
        if not log_id:
            raise HTTPException(status_code=400, detail="ID is required")

        log_to_delete = db.query(Logs).filter(Logs.id == log_id).first()
        if not log_to_delete:
            raise HTTPException(status_code=404, detail=f"Log with ID {log_id} not found")
        
        db.delete(log_to_delete)
        db.commit()
        return {"message": f"Log {log_id} deleted from the database"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@logs_routes.route("/update", methods=["PUT"])
def update_logs():
    db = SessionLocal()
    try:
        data = request.json
        log_id = data.get("id")
        if not log_id:
            raise HTTPException(status_code=400, detail="ID is required")

        log_to_update = db.query(Logs).filter(Logs.id == log_id).first()
        if not log_to_update:
            raise HTTPException(status_code=404, detail=f"Log with ID {log_id} not found")

        log_to_update.level = data.get("level", log_to_update.level)
        log_to_update.origin = data.get("origin", log_to_update.origin)
        log_to_update.action = data.get("action", log_to_update.action)
        log_to_update.description = data.get("description", log_to_update.description)
        log_to_update.status = data.get("status", log_to_update.status)
        log_to_update.log_data = datetime.now()

        db.commit()
        return {"message": f"Log {log_id} updated successfully"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@logs_routes.route("/read-all", methods=["GET", "POST"])
def read_all_logs():
    db = SessionLocal()
    try:
        if request.method == "GET":
            logs = db.query(Logs).all()
            
            if not logs:
                return {"message": "No logs found"}, 200

            logs_list = [{
                "id": log.id,
                "level": log.level,
                "origin": log.origin,
                "action": log.action,
                "description": log.description,
                "status": log.status,
                "log_data": log.log_data.isoformat() if log.log_data else None
            } for log in logs]
            
            return {"logs": logs_list}, 200

        elif request.method == "POST":
            data = request.json
            level = data.get("level")
            status = data.get("status")
            origin = data.get("origin")
            action = data.get("action")

            query = db.query(Logs)
            if level:
                query = query.filter(Logs.level == level)
            if status:
                query = query.filter(Logs.status == status)
            if origin:
                query = query.filter(Logs.origin == origin)
            if action:
                query = query.filter(Logs.action == action)
            
            logs = query.all()
            
            if not logs:
                return {"message": "No logs found with the provided filters"}, 200
            
            logs_list = [{
                "id": log.id,
                "level": log.level,
                "origin": log.origin,
                "action": log.action,
                "description": log.description,
                "status": log.status,
                "log_data": log.log_data
            } for log in logs]
            
            return {"logs": f"{logs_list}"}, 200

    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@logs_routes.route("/read-id", methods=["POST"])
def read_log_id():
    db = SessionLocal()
    try:
        data = request.json
        log_id = data.get("id")
        if not log_id:
            raise HTTPException(status_code=400, detail="ID is required")
        
        log = db.query(Logs).filter(Logs.id == log_id).first()
        log_read = {
            "id": log_id,
            "timestamp": log.timestamp,
            "level": log.level,
            "origin": log.origin,
            "action": log.action,
            "description": log.description,
            "status": log.status,
            "log_data": log.log_data
        }
        
        if not log:
            raise HTTPException(status_code=404, detail=f"Log with ID {log_id} not found")
        return {"message": "Log Lido", "log": f"{log_read}"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()
    