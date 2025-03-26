from flask import request, Blueprint, jsonify
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.prescricao_aceita import PrescricaoAceita
from datetime import datetime

prescricao_aceita_routes = Blueprint('prescricao_aceita', __name__, url_prefix="/prescricao_aceita")

@prescricao_aceita_routes.route("/create", methods=["POST"])
def create_prescricao_aceita():
    db = SessionLocal()
    try: 
        prescricao = PrescricaoAceita(
            id=request.json.get("id"),
            id_prescricao_on_hold=request.json.get("id_prescricao_on_hold"),
            id_farmaceutico=request.json.get("id_farmaceutico"),
            data_validacao=request.json.get("data_validacao")
        )
        db.add(prescricao)
        db.commit()
        return {"message": "Prescricao aceita criada com sucesso"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_aceita_routes.route("/update", methods=["PUT"])
def update_prescricao_aceita():

    db = SessionLocal()
    try:
        data = request.json
        prescricao_aceita_id = data.get("id")
        if not prescricao_aceita_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        prescricao_aceita_to_update = db.query(PrescricaoAceita).filter(PrescricaoAceita.id == prescricao_aceita_id).first()
        if not prescricao_aceita_to_update:
            raise HTTPException(status_code=404, detail=f"Prescricao com ID {prescricao_aceita_id} não encontrada")
        
        prescricao_aceita_to_update.id_prescricao_on_hold = data.get("id_prescricao_on_hold", prescricao_aceita_to_update.id_prescricao_on_hold)
        prescricao_aceita_to_update.id_farmaceutico = data.get("id_farmaceutico", prescricao_aceita_to_update.id_farmaceutico)
        prescricao_aceita_to_update.data_validacao = data.get("data_validacao", prescricao_aceita_to_update.data_validacao)
        
        db.commit()
        return {"message": f"Prescricao {prescricao_aceita_id} atualizada com sucesso"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_aceita_routes.route("/delete", methods=["DELETE"])
def delete_prescricao_aceita():
    db = SessionLocal()
    try:
        prescricao_aceita_id = request.args.get("id")
        if not prescricao_aceita_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        prescricao_aceita_to_delete = db.query(PrescricaoAceita).filter(PrescricaoAceita.id == prescricao_aceita_id).first()
        if not prescricao_aceita_to_delete:
            raise HTTPException(status_code=404, detail=f"Prescricao com ID {prescricao_aceita_id} não encontrada")
        
        db.delete(prescricao_aceita_to_delete)
        db.commit()
        return {"message": f"Prescricao {prescricao_aceita_id} deletada com sucesso"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_aceita_routes.route("/read-all", methods=["GET", "POST"])
def read_all_prescricao_aceita():
    db = SessionLocal()
    try:
        if request.method == "GET":
            prescricoes = db.query(PrescricaoAceita).all()
            
            if not prescricoes:
                return {"message": "Nenhuma prescrição aceita encontrada"}, 200

            prescricoes_list = [{
                "id": prescricao.id,
                "id_prescricao_on_hold": prescricao.id_prescricao_on_hold,
                "id_farmaceutico": prescricao.id_farmaceutico,
                "data_validacao": prescricao.data_validacao.isoformat() if prescricao.data_validacao else None
            } for prescricao in prescricoes]
            
            return {"prescricoes": prescricoes_list}, 200
            
        elif request.method == "POST":
            data = request.json
            if not data:
                raise HTTPException(status_code=400, detail="Nenhum dado fornecido no corpo da requisição")

            id_prescricao_on_hold = data.get("id_prescricao_on_hold")
            id_farmaceutico = data.get("id_farmaceutico")
            
            query = db.query(PrescricaoAceita)
            if id_prescricao_on_hold:
                query = query.filter(PrescricaoAceita.id_prescricao_on_hold == id_prescricao_on_hold)
            if id_farmaceutico:
                query = query.filter(PrescricaoAceita.id_farmaceutico == id_farmaceutico)
            
            prescricoes = query.all()
            
            if not prescricoes:
                return {"message": "Nenhuma prescrição aceita encontrada com os filtros fornecidos"}, 200
            
            prescricoes_list = [{
                "id": prescricao.id,
                "id_prescricao_on_hold": prescricao.id_prescricao_on_hold,
                "id_farmaceutico": prescricao.id_farmaceutico,
                "data_validacao": prescricao.data_validacao.isoformat() if prescricao.data_validacao else None
            } for prescricao in prescricoes]
            
            return {"prescricoes": prescricoes_list}, 200
            
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_aceita_routes.route("/read-id", methods=["POST"])
def read_prescricao_aceita_id():
    db = SessionLocal()
    try:
        prescricao_aceita_id = request.json.get("id")
        if not prescricao_aceita_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        prescricao_aceita = db.query(PrescricaoAceita).filter(PrescricaoAceita.id == prescricao_aceita_id).first()
        if not prescricao_aceita:
            raise HTTPException(status_code=404, detail=f"Prescrição com ID {prescricao_aceita_id} não encontrada")
            
        prescricao_detalhes = {
            "id": prescricao_aceita.id,
            "id_prescricao_on_hold": prescricao_aceita.id_prescricao_on_hold,
            "id_farmaceutico": prescricao_aceita.id_farmaceutico,
            "data_validacao": prescricao_aceita.data_validacao.isoformat() if prescricao_aceita.data_validacao else None
        }
        
        return {"message": "Prescrição encontrada", "prescricao": prescricao_detalhes}, 200
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()