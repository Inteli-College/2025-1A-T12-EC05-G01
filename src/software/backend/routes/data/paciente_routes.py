from flask import request, Blueprint, jsonify
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.paciente import Paciente

paciente_routes = Blueprint('paciente', __name__, url_prefix="/paciente")

@paciente_routes.route("/create", methods=["POST"])
def create_paciente():
    data = request.json
    db = SessionLocal()
    try:
        paciente = Paciente(
            nome = data.get("nome"),
            leito = data.get("leito"),
            hc = data.get("hc")
        )
        db.add(paciente)
        db.commit()
        db.refresh(paciente)  # Atualiza o objeto com o id gerado
        return jsonify({"id": paciente.id, "message": "Paciente criado com sucesso"}), 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@paciente_routes.route("/delete", methods=["DELETE"])
def delete_paciente():
    db = SessionLocal()
    try:
        paciente_id = request.args.get("id")
        if not paciente_id:
            raise HTTPException(status_code=400, detail="ID is required")

        paciente_to_delete = db.query(Paciente).filter(Paciente.id == paciente_id).first()
        if not paciente_to_delete:
            raise HTTPException(status_code=404, detail=f"Paciente com ID {paciente_id} não encontrado")
        
        db.delete(paciente_to_delete)
        db.commit()
        return {"message": f"Paciente com ID {paciente_id} deletado do banco"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@paciente_routes.route("/update", methods=["PUT"])
def update_paciente():
    db = SessionLocal()
    try:
        data = request.json
        paciente_id = data.get("id")
        if not paciente_id:
            raise HTTPException(status_code=400, detail="ID is required")

        paciente_to_update = db.query(Paciente).filter(Paciente.id == paciente_id).first()
        if not paciente_to_update:
            raise HTTPException(status_code=404, detail=f"Paciente com ID {paciente_id} não encontrado")

        paciente_to_update.nome = data.get("nome", paciente_to_update.nome)
        paciente_to_update.leito = data.get("leito", paciente_to_update.leito)
        paciente_to_update.hc = data.get("hc", paciente_to_update.hc)

        db.commit()
        return {"message": f"Paciente de ID {paciente_id} atualizado"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@paciente_routes.route("/read-all", methods=["GET", "POST"])
def read_all_pacientes():
    db = SessionLocal()
    try:
        if request.method == "GET":
            pacientes = db.query(Paciente).all()
            
            if not pacientes:
                return {"message": "No rows found"}, 200

            pacientes = [{
                "id": paciente.id,
                "nome": paciente.nome,
                "leito": paciente.leito,
                "hc": paciente.hc
            } for paciente in pacientes]
            
            return {"message": "Lista de pacientes retornada", "Pacientes": pacientes}, 200

        elif request.method == "POST":
            data = request.json

            nome = data.get("nome")
            leito = data.get("leito")
            hc = data.get("hc")

            query = db.query(Paciente)
            
            if nome:
                query = query.filter(Paciente.nome == nome)
            if leito:
                query = query.filter(Paciente.leito == leito)
            if hc:
                query = query.filter(Paciente.hc == hc)
            
            pacientes = query.all()
            
            if not pacientes:
                return {"message": "No rows found with the provided filters"}, 200
            
            pacientes = [{
                "id": paciente.id,
                "nome": paciente.nome,
                "leito": paciente.leito,
                "hc": paciente.hc             
            } for paciente in pacientes]
            
            return {"message": "Lista de Pacientes Retornada", "Pacientes": f"{pacientes}"}, 200

    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@paciente_routes.route("/read-id", methods=["POST"])
def read_pacientes_id():
    db = SessionLocal()
    try:
        data = request.json
        paciente_id = data.get("id")
        if not paciente_id:
            raise HTTPException(status_code=400, detail="ID is required")
        
        paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
        paciente = {
            "id": paciente.id,
            "nome": paciente.nome,
            "leito": paciente.leito,
            "hc": paciente.hc            
        }
        
        if not paciente:
            raise HTTPException(status_code=404, detail=f"Paciente com ID {paciente_id} não encontrado")
        return {"message": "Paciente Retornado", "Paciente": f"{paciente}"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()
    