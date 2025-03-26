from flask import request, Blueprint
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.medico import Medico
from flask_cors import CORS, cross_origin

medicos_routes = Blueprint('medico', __name__, url_prefix="/medico")
CORS(medicos_routes, resources={r"/*": {"origins": "*"}})

@medicos_routes.route("/create", methods=["POST"])
@cross_origin()
def create_medico():
    data = request.json
    db = SessionLocal()
    try:
        medico = Medico(
            nome = data.get("nome"),
        )
        db.add(medico)
        db.commit()
        return {"message": "Novo medico salvo"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@medicos_routes.route("/delete", methods=["DELETE", "OPTIONS"])
@cross_origin()
def delete_medico():
    db = SessionLocal()
    try:
        medico_id = request.args.get("id")
        if not medico_id:
            raise HTTPException(status_code=400, detail="ID is required")

        medico_to_delete = db.query(Medico).filter(Medico.id == medico_id).first()
        if not medico_to_delete:
            raise HTTPException(status_code=404, detail=f"Medico com ID {medico_id} não encontrado")
        
        db.delete(medico_to_delete)
        db.commit()
        return {"message": f"Medico com ID {medico_id} deletado do banco"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@medicos_routes.route("/update", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_medico():
    db = SessionLocal()
    try:
        data = request.json
        medico_id = data.get("id")
        if not medico_id:
            raise HTTPException(status_code=400, detail="ID is required")

        medico_to_update = db.query(Medico).filter(Medico.id == medico_id).first()
        if not medico_to_update:
            raise HTTPException(status_code=404, detail=f"Medico com ID {medico_id} não encontrado")

        medico_to_update.nome = data.get("nome", medico_to_update.nome)

        db.commit()
        return {"message": f"Medico de ID {medico_id} atualizado"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@medicos_routes.route("/read-all", methods=["GET", "POST", "OPTIONS"])
@cross_origin()
def read_all_medicos():
    db = SessionLocal()
    try:
        if request.method == "GET":
            medicos = db.query(Medico).all()
            
            if not medicos:
                return {"message": "No rows found"}, 200

            medicos = [{
                "id": medico.id,
                "nome": medico.nome
            } for medico in medicos]
            
            return {"message": "Lista de medicos retornada", "Medicos": medicos}, 200

        elif request.method == "POST":
            data = request.json

            nome = data.get("nome")

            query = db.query(Medico)
            
            if nome:
                query = query.filter(Medico.nome == nome)

            medicos = query.all()
            
            if not medicos:
                return {"message": "No rows found with the provided filters"}, 200
            
            medicos = [{
                "id": medico.id,
                "nome": medico.nome,
            } for medico in medicos]
            
            return {"message": "Lista de Medicos Retornada", "Medicos": f"{medicos}"}, 200

    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@medicos_routes.route("/read-id", methods=["POST", "OPTIONS"])
@cross_origin()
def read_medicos_id():
    db = SessionLocal()
    try:
        data = request.json
        medico_id = data.get("id")
        if not medico_id:
            raise HTTPException(status_code=400, detail="ID is required")
        
        medico = db.query(Medico).filter(Medico.id == medico_id).first()
        medico = {
            "id": medico.id,
            "nome": medico.nome
        }
        
        if not medico:
            raise HTTPException(status_code=404, detail=f"Medico com ID {medico_id} não encontrado")
        return {"message": "Medico Retornado", "Medico": f"{medico}"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()
