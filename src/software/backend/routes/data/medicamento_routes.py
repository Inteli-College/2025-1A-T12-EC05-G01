from flask import request, Blueprint
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.medicamento import Medicamento

medicamento_routes = Blueprint('medicamento', __name__, url_prefix="/medicamento")

@medicamento_routes.route("/create", methods=["POST"])
def create_medicamento():
    data = request.json
    db = SessionLocal()
    try:
        medicamento = Medicamento(
            nome = data.get("nome"),
            dosagem = data.get("dosagem"),
            peso = data.get("peso"),
            qr_code = data.get("qr_code")
        )
        db.add(medicamento)
        db.commit()
        return {"message": "Novo medicamento salvo"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@medicamento_routes.route("/delete", methods=["DELETE"])
def delete_medicamento():
    db = SessionLocal()
    try:
        medicamento_id = request.args.get("id")
        if not medicamento_id:
            raise HTTPException(status_code=400, detail="ID is required")

        medicamento_to_delete = db.query(Medicamento).filter(Medicamento.id == medicamento_id).first()
        if not medicamento_to_delete:
            raise HTTPException(status_code=404, detail=f"Medicamento com ID {medicamento_id} não encontrado")
        
        db.delete(medicamento_to_delete)
        db.commit()
        return {"message": f"medicamento com ID {medicamento_id} deletado do banco"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@medicamento_routes.route("/update", methods=["PUT"])
def update_medicamento():
    db = SessionLocal()
    try:
        data = request.json
        medicamento_id = data.get("id")
        if not medicamento_id:
            raise HTTPException(status_code=400, detail="ID is required")

        medicamento_to_update = db.query(Medicamento).filter(Medicamento.id == medicamento_id).first()
        if not medicamento_to_update:
            raise HTTPException(status_code=404, detail=f"Medicamento com ID {medicamento_id} não encontrado")

        medicamento_to_update.nome = data.get("nome", medicamento_to_update.nome)

        db.commit()
        return {"message": f"Medicamento de ID {medicamento_id} atualizado"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@medicamento_routes.route("/read-all", methods=["GET", "POST"])
def read_all_medicamento():
    db = SessionLocal()
    try:
        if request.method == "GET":
            medicamentos = db.query(Medicamento).all()
            
            if not medicamentos:
                return {"message": "No rows found"}, 200

            medicamentos = [{
                "id": medicamento.id,
                "nome": medicamento.nome
            } for medicamento in medicamentos]
            
            return {"medicamentos": medicamentos}, 200

        elif request.method == "POST":
            data = request.json

            nome = data.get("nome")

            query = db.query(Medicamento)
            
            if nome:
                query = query.filter(Medicamento.nome == nome)
            
            medicamentos = query.all()
            
            if not medicamentos:
                return {"message": "No rows found with the provided filters"}, 200
            
            medicamentos = [{
                "id": medicamento.id,
                "nome": medicamento.nome,
                "dosagem": medicamento.dosagem,
                "peso": medicamento.peso,
                "qr_code": medicamento.qr_code                
            } for medicamento in medicamentos]
            
            return {"message": "Medicamentos Lido", "medicamentos": f"{medicamentos}"}, 200

    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@medicamento_routes.route("/read-id", methods=["POST"])
def read_medicamentos_id():
    db = SessionLocal()
    try:
        data = request.json
        medicamento_id = data.get("id")
        if not medicamento_id:
            raise HTTPException(status_code=400, detail="ID is required")
        
        medicamento = db.query(Medicamento).filter(Medicamento.id == medicamento_id).first()
        medicamento = {
            "id": medicamento.id,
                "nome": medicamento.nome,
                "dosagem": medicamento.dosagem,
                "peso": medicamento.peso,
                "qr_code": medicamento.qr_code             
        }
        
        if not medicamento:
            raise HTTPException(status_code=404, detail=f"medicamento com ID {medicamento} não encontrado")
        return {"message": "Medicamento Lido", "medicamento": f"{medicamento}"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()
    