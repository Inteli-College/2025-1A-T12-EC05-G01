from flask import request, Blueprint
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.perdas import Perdas
from datetime import datetime

perdas_routes = Blueprint('perdas', __name__, url_prefix="/perdas")

@perdas_routes.route("/create", methods=["POST"])
def create_perda():
    db = SessionLocal()
    try:
        perda = Perdas(
            id_estoque=request.json.get("id_estoque"),
            motivo=request.json.get("motivo"),
            data_perda=datetime.now()
        )
        db.add(perda)
        db.commit()
        return {"message": "Registro de perda salvo com sucesso"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@perdas_routes.route("/update", methods=["PUT"])
def update_perda():
    db = SessionLocal()
    try:
        data = request.json
        perda_id = data.get("id")
        if not perda_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")

        perda_to_update = db.query(Perdas).filter(Perdas.id == perda_id).first()
        if not perda_to_update:
            raise HTTPException(status_code=404, detail=f"Registro de perda com ID {perda_id} não encontrado")

        perda_to_update.id_estoque = data.get("id_estoque", perda_to_update.id_estoque)
        perda_to_update.motivo = data.get("motivo", perda_to_update.motivo)
        perda_to_update.data_perda = data.get("data_perda", perda_to_update.data_perda)

        db.commit()
        return {"message": f"Registro de perda {perda_id} atualizado com sucesso"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@perdas_routes.route("/delete", methods=["DELETE"])
def delete_perda():
    db = SessionLocal()
    try:
        perda_id = request.args.get("id")
        if not perda_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        perda_to_delete = db.query(Perdas).filter(Perdas.id == perda_id).first()
        if not perda_to_delete:
            raise HTTPException(status_code=404, detail=f"Registro de perda com ID {perda_id} não encontrado")
        
        db.delete(perda_to_delete)
        db.commit()
        return {"message": f"Registro de perda {perda_id} excluído com sucesso"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@perdas_routes.route("/read-all", methods=["GET", "POST"])
def read_all_perdas():
    db = SessionLocal()
    try:
        if request.method == "GET":
            perdas = db.query(Perdas).all()
            
            if not perdas:
                return {"message": "Nenhum registro de perda encontrado"}, 200

            perdas_list = [{
                "id": perda.id,
                "id_estoque": perda.id_estoque,
                "motivo": perda.motivo,
                "data_perda": perda.data_perda if perda.data_perda else None
            } for perda in perdas]
            
            return {"perdas": perdas_list}, 200
            
        elif request.method == "POST":
            data = request.json
            if not data:
                raise HTTPException(status_code=400, detail="Nenhum dado fornecido no corpo da requisição")

            id_estoque = data.get("id_estoque")
            motivo = data.get("motivo")
            
            query = db.query(Perdas)
            if id_estoque:
                query = query.filter(Perdas.id_estoque == id_estoque)
            if motivo:
                query = query.filter(Perdas.motivo.like(f"%{motivo}%"))
            
            perdas = query.all()
            
            if not perdas:
                return {"message": "Nenhum registro de perda encontrado com os filtros fornecidos"}, 200
            
            perdas_list = [{
                "id": perda.id,
                "id_estoque": perda.id_estoque,
                "motivo": perda.motivo,
                "data_perda": perda.data_perda if perda.data_perda else None
            } for perda in perdas]
            
            return {"perdas": perdas_list}, 200
            
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@perdas_routes.route("/read-id", methods=["POST"])
def read_perda_id():
    db = SessionLocal()
    try:
        perda_id = request.json.get("id")
        if not perda_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        perda = db.query(Perdas).filter(Perdas.id == perda_id).first()
        if not perda:
            raise HTTPException(status_code=404, detail=f"Registro de perda com ID {perda_id} não encontrado")
            
        perda_detalhes = {
            "id": perda.id,
            "id_estoque": perda.id_estoque,
            "motivo": perda.motivo,
            "data_perda": perda.data_perda if perda.data_perda else None
        }
        
        return {"message": "Registro de perda encontrado", "perda": perda_detalhes}, 200
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()