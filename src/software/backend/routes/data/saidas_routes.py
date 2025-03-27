from flask import request, Blueprint
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.saida import Saidas

saida_routes = Blueprint('saidas', __name__, url_prefix="/saidas")

@saida_routes.route("/create", methods=["POST"])
def create_saida():
    db = SessionLocal()
    try:
        saida = Saidas(
            id_estoque=request.json.get("id_estoque"),
            id_paciente=request.json.get("id_paciente"),
            quantidade=request.json.get("quantidade")
        )
        
        db.add(saida)
        db.commit()
        return {"message": "Nova saída registrada com sucesso"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@saida_routes.route("/delete", methods=["DELETE"])
def delete_saida():
    db = SessionLocal()
    try:
        saida_id = request.args.get("id")
        if not saida_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")

        saida = db.query(Saidas).filter(Saidas.id == saida_id).first()
        if not saida:
            raise HTTPException(status_code=404, detail="Saída não encontrada")
        
        db.delete(saida)
        db.commit()
        return {"message": f"Saída ID {saida_id} removida"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@saida_routes.route("/update", methods=["PUT"])
def update_saida():
    db = SessionLocal()
    try:
        data = request.json
        saida_id = data.get("id")
        if not saida_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")

        saida = db.query(Saidas).filter(Saidas.id == saida_id).first()
        if not saida:
            raise HTTPException(status_code=404, detail="Saída não encontrada")

        if "id_estoque" in data:
            saida.id_estoque = data["id_estoque"]
        if "id_paciente" in data:
            saida.id_paciente = data["id_paciente"]
        if "quantidade" in data:
            saida.quantidade = data["quantidade"]

        db.commit()
        return {"message": f"Saída ID {saida_id} atualizada"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@saida_routes.route("/read-all", methods=["GET", "POST"])
def read_all_saidas():
    db = SessionLocal()
    try:
        if request.method == "GET":
            saidas = db.query(Saidas).all()

            if not saidas:
                return {"message": "No rows found"}, 200
            
            saidas = [{
                "id": row.id,
                "id_estoque": row.id_estoque,
                "id_paciente": row.id_paciente,
                "quantidade": row.quantidade,
                "data_saida": row.data_saida.isoformat() if row.data_saida else None
            } for row in saidas]
            
            return {"saidas": saidas}, 200
        
        elif request.method == "POST":
            filters = request.json
            query = db.query(Saidas)
            
            if "id_estoque" in filters:
                query = query.filter(Saidas.id_estoque == filters["id_estoque"])
            if "id_paciente" in filters:
                query = query.filter(Saidas.id_paciente == filters["id_paciente"])
            if "quantidade" in filters:
                query = query.filter(Saidas.quantidade == filters["quantidade"])
            if "data_saida" in filters:
                query = query.filter(Saidas.data_saida == filters["data_saida"])
            
            saidas = [{
                "id": s.id,
                "id_estoque": s.id_estoque,
                "id_paciente": s.id_paciente,
                "quantidade": s.quantidade,
                "data_saida": s.data_saida.isoformat() if s.data_saida else None
            } for s in query.all()]
            
            return {"saidas": saidas}, 200
            
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@saida_routes.route("/read-id", methods=["POST"])
def read_saida_id():
    db = SessionLocal()
    try:
        saida_id = request.json.get("id")
        if not saida_id:
            raise HTTPException(status_code=400, detail="ID é obrigatório")
        
        row = db.query(Saidas).filter(Saidas.id == saida_id).first()
        
        saidas = {
            "id": row.id,
            "id_estoque": row.id_estoque,
            "id_paciente": row.id_paciente,
            "quantidade": row.quantidade,
            "data_saida": row.data_saida.isoformat() if row.data_saida else None
        }
        
        return {"saida": saidas}, 200
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()