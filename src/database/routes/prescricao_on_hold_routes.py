from flask import request, Blueprint
from fastapi import HTTPException
from ..db_conexao import engine, Base, get_db, SessionLocal
from ..models.prescricao_on_hold import PrescricaoOnHold
from ..models.medico import Medico
from ..models.paciente import Paciente


from ..models.prescricao_on_hold import PrescricaoOnHold

prescricao_on_hold_routes = Blueprint('prescricao_on_hold', __name__, url_prefix="/prescricao_on_hold")

@prescricao_on_hold_routes.route("/create", methods=["POST"])
def create_prescricao_on_hold():
    db = SessionLocal()
    try:
        prescricao_on_hold = PrescricaoOnHold(
            id_medico=request.json.get("id_medico"),
            id_paciente=request.json.get("id_paciente"),
            data_prescricao=request.json.get("data_prescricao"),
        )
        db.add(prescricao_on_hold)
        db.commit()
        return {"message": "Nova prescricao em espera adicionada"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_on_hold_routes.route("/delete", methods=["DELETE"])
def delete_prescricao_on_hold():
    db = SessionLocal()
    try:
        prescricao_on_hold_id = request.args.get("id")
        if not prescricao_on_hold_id:
            raise HTTPException(status_code=400, detail="ID is required")

        prescricao_on_hold_to_delete = db.query(PrescricaoOnHold).filter(PrescricaoOnHold.id == prescricao_on_hold_id).first()
        if not prescricao_on_hold_to_delete:
            raise HTTPException(status_code=404, detail=f"PrescricaoOnHold com ID {prescricao_on_hold_to_delete} não encontrado")
        
        db.delete(prescricao_on_hold_to_delete)
        db.commit()
        return {"message": f"Linha {prescricao_on_hold_id} deletado do banco"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_on_hold_routes.route("/update", methods=["PUT"])
def update_prescricao_on_hold():
    db = SessionLocal()
    try:
        data = request.json
        prescricao_on_hold_id = data.get("id")
        if not prescricao_on_hold_id:
            raise HTTPException(status_code=400, detail="ID is required")

        prescricao_on_hold_to_update = db.query(PrescricaoOnHold).filter(PrescricaoOnHold.id == prescricao_on_hold_id).first()
        if not prescricao_on_hold_to_update:
            raise HTTPException(status_code=404, detail=f"PrescricaoOnHold com ID {prescricao_on_hold_to_update} não encontrado")

        prescricao_on_hold_to_update.id_medico = data.get("id_medico", prescricao_on_hold_to_update.id_medico)
        prescricao_on_hold_to_update.id_paciente = data.get("id_paciente", prescricao_on_hold_to_update.id_paciente)
        prescricao_on_hold_to_update.data_prescricao = data.get("data_prescricao", prescricao_on_hold_to_update.data_prescricao)

        db.commit()
        return {"message": f"PrescricaoOnHold {prescricao_on_hold_id} updated successfully"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_on_hold_routes.route("/read-all", methods=["GET", "POST"])
def read_all_prescricao_on_hold():
    db = SessionLocal()
    try:
        if request.method == "GET":
            prescricao_on_hold = db.query(PrescricaoOnHold).all()
            
            if not prescricao_on_hold:
                return {"message": "No rows found"}, 200

            prescricao_on_hold = [{
                "id": row.id,
                "id_medico": row.id_medico,
                "id_paciente": row.id_paciente,
                "data_prescricao": row.data_prescricao,
            } for row in prescricao_on_hold]
            
            return {"PrescricaoOnHold": prescricao_on_hold}, 200

        elif request.method == "POST":
            data = request.json

            id_medico = data.get("id_medico")
            id_paciente = data.get("id_paciente")
            data_prescricao = data.get("data_prescricao")


            query = db.query(PrescricaoOnHold)
            if id_medico:
                query = query.filter(PrescricaoOnHold.id_medico == id_medico)
            if id_paciente:
                query = query.filter(PrescricaoOnHold.id_paciente == id_paciente)           
            if data_prescricao:
                query = query.filter(PrescricaoOnHold.data_prescricao == data_prescricao)            
            
            prescricao_on_hold = query.all()
            
            if not prescricao_on_hold:
                return {"message": "No rows found with the provided filters"}, 200
            
            prescricao_on_hold = [{
                "id": row.id,
                "id_medico": row.id_medico,
                "id_paciente": row.id_paciente,
                "data_prescricao": row.data_prescricao,
            } for row in prescricao_on_hold]
            
            return {"PrescricaoOnHold": f"{prescricao_on_hold}"}, 200

    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@prescricao_on_hold_routes.route("/read-id", methods=["POST"])
def read_prescricao_on_hold_id():
    db = SessionLocal()
    try:
        data = request.json
        row_id = data.get("id")
        if not row_id:
            raise HTTPException(status_code=400, detail="ID is required")
        
        row = db.query(PrescricaoOnHold).filter(PrescricaoOnHold.id == row_id).first()
        prescricao_on_hold = {
            "id": row.id,
            "id_medico": row.id_medico,                "id_paciente": row.id_paciente,
            "data_prescricao": row.data_prescricao,
        }

        
        if not prescricao_on_hold:
            raise HTTPException(status_code=404, detail=f"PrescricaoOnHold com ID {prescricao_on_hold} não encontrado")
        return {"message": "PrescricaoOnHold Lido", "PrescricaoOnHold": f"{prescricao_on_hold}"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()
    