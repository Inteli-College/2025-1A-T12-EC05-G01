from flask import request, Blueprint
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.prescricao_medicamento import PrescricaoMedicamento
from datetime import datetime

prescricao_medicamento_routes = Blueprint('prescricao_medicamento', __name__, url_prefix="/prescricao_medicamento")

@prescricao_medicamento_routes.route("/create", methods=["POST"])
def create_prescricao_medicamento():
    db = SessionLocal()
    try:
        prescricao_medicamento = PrescricaoMedicamento(
            id_prescricao_on_hold=request.json.get("id_prescricao_on_hold"),
            id_prescricao_aceita=request.json.get("id_prescricao_aceita"),
            id_medicamento=request.json.get("id_medicamento"),
            quantidade=request.json.get("quantidade"),
            status_medicamento=request.json.get("status_medicamento")
        )
        db.add(prescricao_medicamento)
        db.commit()
        return {"message": "Prescrição de medicamento criada com sucesso"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_medicamento_routes.route("/update", methods=["PUT"])
def update_prescricao_medicamento():
    db = SessionLocal()
    try:
        data = request.json
        prescricao_medicamento_id = data.get("id")
        if not prescricao_medicamento_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        prescricao_medicamento_to_update = db.query(PrescricaoMedicamento).filter(PrescricaoMedicamento.id == prescricao_medicamento_id).first()
        if not prescricao_medicamento_to_update:
            raise HTTPException(status_code=404, detail=f"Prescrição de medicamento com ID {prescricao_medicamento_id} não encontrada")
        
        prescricao_medicamento_to_update.id_prescricao_on_hold = data.get("id_prescricao_on_hold", prescricao_medicamento_to_update.id_prescricao_on_hold)
        prescricao_medicamento_to_update.id_prescricao_aceita = data.get("id_prescricao_aceita", prescricao_medicamento_to_update.id_prescricao_aceita)
        prescricao_medicamento_to_update.id_medicamento = data.get("id_medicamento", prescricao_medicamento_to_update.id_medicamento)
        prescricao_medicamento_to_update.quantidade = data.get("quantidade", prescricao_medicamento_to_update.quantidade)
        prescricao_medicamento_to_update.status_medicamento = data.get("status_medicamento", prescricao_medicamento_to_update.status_medicamento)
        
        db.commit()
        return {"message": f"Prescrição de medicamento {prescricao_medicamento_id} atualizada com sucesso"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_medicamento_routes.route("/delete", methods=["DELETE"])
def delete_prescricao_medicamento():
    db = SessionLocal()
    try:
        prescricao_medicamento_id = request.args.get("id")
        if not prescricao_medicamento_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        prescricao_medicamento_to_delete = db.query(PrescricaoMedicamento).filter(PrescricaoMedicamento.id == prescricao_medicamento_id).first()
        if not prescricao_medicamento_to_delete:
            raise HTTPException(status_code=404, detail=f"Prescrição de medicamento com ID {prescricao_medicamento_id} não encontrada")
        
        db.delete(prescricao_medicamento_to_delete)
        db.commit()
        return {"message": f"Prescrição de medicamento {prescricao_medicamento_id} deletada com sucesso"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_medicamento_routes.route("/read-all", methods=["GET", "POST"])
def read_all_prescricao_medicamento():
    db = SessionLocal()
    try:
        if request.method == "GET":
            prescricoes_medicamento = db.query(PrescricaoMedicamento).all()
            
            if not prescricoes_medicamento:
                return {"message": "Nenhuma prescrição de medicamento encontrada"}, 200

            prescricoes_medicamento_list = [{
                "id": prescricao.id,
                "id_prescricao_on_hold": prescricao.id_prescricao_on_hold,
                "id_prescricao_aceita": prescricao.id_prescricao_aceita,
                "id_medicamento": prescricao.id_medicamento,
                "quantidade": prescricao.quantidade,
                "status_medicamento": prescricao.status_medicamento
            } for prescricao in prescricoes_medicamento]
            
            return {"prescricoes_medicamento": prescricoes_medicamento_list}, 200
            
        elif request.method == "POST":
            data = request.json
            if not data:
                raise HTTPException(status_code=400, detail="Nenhum dado fornecido no corpo da requisição")

            id_prescricao_on_hold = data.get("id_prescricao_on_hold")
            id_prescricao_aceita = data.get("id_prescricao_aceita")
            id_medicamento = data.get("id_medicamento")
            status_medicamento = data.get("status_medicamento")
            
            query = db.query(PrescricaoMedicamento)
            if id_prescricao_on_hold:
                query = query.filter(PrescricaoMedicamento.id_prescricao_on_hold == id_prescricao_on_hold)
            if id_prescricao_aceita:
                query = query.filter(PrescricaoMedicamento.id_prescricao_aceita == id_prescricao_aceita)
            if id_medicamento:
                query = query.filter(PrescricaoMedicamento.id_medicamento == id_medicamento)
            if status_medicamento:
                query = query.filter(PrescricaoMedicamento.status_medicamento == status_medicamento)
            
            prescricoes_medicamento = query.all()
            
            if not prescricoes_medicamento:
                return {"message": "Nenhuma prescrição de medicamento encontrada com os filtros fornecidos"}, 200
            
            prescricoes_medicamento_list = [{
                "id": prescricao.id,
                "id_prescricao_on_hold": prescricao.id_prescricao_on_hold,
                "id_prescricao_aceita": prescricao.id_prescricao_aceita,
                "id_medicamento": prescricao.id_medicamento,
                "quantidade": prescricao.quantidade,
                "status_medicamento": prescricao.status_medicamento
            } for prescricao in prescricoes_medicamento]
            
            return {"prescricoes_medicamento": prescricoes_medicamento_list}, 200
            
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_medicamento_routes.route("/read-id", methods=["POST"])
def read_prescricao_medicamento_id():
    db = SessionLocal()
    try:
        prescricao_medicamento_id = request.json.get("id")
        if not prescricao_medicamento_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        prescricao_medicamento = db.query(PrescricaoMedicamento).filter(PrescricaoMedicamento.id == prescricao_medicamento_id).first()
        if not prescricao_medicamento:
            raise HTTPException(status_code=404, detail=f"Prescrição de medicamento com ID {prescricao_medicamento_id} não encontrada")
            
        prescricao_medicamento_detalhes = {
            "id": prescricao_medicamento.id,
            "id_prescricao_on_hold": prescricao_medicamento.id_prescricao_on_hold,
            "id_prescricao_aceita": prescricao_medicamento.id_prescricao_aceita,
            "id_medicamento": prescricao_medicamento.id_medicamento,
            "quantidade": prescricao_medicamento.quantidade,
            "status_medicamento": prescricao_medicamento.status_medicamento
        }
        
        return {"message": "Prescrição de medicamento encontrada", "prescricao_medicamento": prescricao_medicamento_detalhes}, 200
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()