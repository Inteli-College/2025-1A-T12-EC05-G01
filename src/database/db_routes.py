from flask import Flask, jsonify, request
from sqlalchemy.orm import Session
from .db_conexao import engine, Base, get_db, SessionLocal
from .models.logs import Logs
from datetime import datetime

app = Flask(__name__)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

@app.route("/")
def connect_database():
    return jsonify({"message": "Database connected!"})

@app.route("/logs/create", methods=["POST"])
def create_logs():
    db = SessionLocal()  # Open a new session
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
        db.close()  # Close the session

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
