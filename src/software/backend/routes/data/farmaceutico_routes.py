from flask import request, Blueprint
from fastapi import HTTPException
from ....database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.farmaceuticos import Farmaceutico

farmaceutico_routes = Blueprint('farmaceutico', __name__, url_prefix="/farmaceutico")

@farmaceutico_routes.route("/create", methods=["POST"])
def create_farmaceutico():
    data = request.json
    db = SessionLocal()
    try:
        farmaceutico = Farmaceutico(
            nome = data.get("nome")
        )
        db.add(farmaceutico)
        db.commit()
        return {"message": "Novo farmaceutico salvo"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@farmaceutico_routes.route("/delete", methods=["DELETE"])
def delete_farmaceutico():
    db = SessionLocal()
    try:
        farmaceutico_id = request.args.get("id")
        if not farmaceutico_id:
            raise HTTPException(status_code=400, detail="ID is required")

        farmaceutico_to_delete = db.query(Farmaceutico).filter(Farmaceutico.id == farmaceutico_id).first()
        if not farmaceutico_to_delete:
            raise HTTPException(status_code=404, detail=f"Farmaceutico com ID {farmaceutico_id} não encontrado")
        
        db.delete(farmaceutico_to_delete)
        db.commit()
        return {"message": f"Farmaceutico com ID {farmaceutico_id} deletado do banco"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@farmaceutico_routes.route("/update", methods=["PUT"])
def update_farmaceutico():
    db = SessionLocal()
    try:
        data = request.json
        farmaceutico_id = data.get("id")
        if not farmaceutico_id:
            raise HTTPException(status_code=400, detail="ID is required")

        farmaceutico_to_update = db.query(Farmaceutico).filter(Farmaceutico.id == farmaceutico_id).first()
        if not farmaceutico_to_update:
            raise HTTPException(status_code=404, detail=f"Farmaceutico com ID {farmaceutico_id} não encontrado")

        farmaceutico_to_update.nome = data.get("nome", farmaceutico_to_update.nome)

        db.commit()
        return {"message": f"Farmeceutico de ID {farmaceutico_id} atualizado"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@farmaceutico_routes.route("/read-all", methods=["GET", "POST"])
def read_all_farmeceuticos():
    db = SessionLocal()
    try:
        if request.method == "GET":
            farmeceuticos = db.query(Farmaceutico).all()
            
            if not farmeceuticos:
                return {"message": "No rows found"}, 200

            farmeceuticos = [{
                "id": farmaceutico.id,
                "nome": farmaceutico.nome
            } for farmaceutico in farmeceuticos]
            
            return {"farmaceuticos": farmeceuticos}, 200

        elif request.method == "POST":
            data = request.json

            nome = data.get("nome")

            query = db.query(Farmaceutico)
            
            if nome:
                query = query.filter(Farmaceutico.nome == nome)
            
            farmeceuticos = query.all()
            
            if not farmeceuticos:
                return {"message": "No rows found with the provided filters"}, 200
            
            farmeceuticos = [{
                "id": farmaceutico.id,
                "nome": farmaceutico.nome                
            } for farmaceutico in farmeceuticos]
            
            return {"farmeceuticos": f"{farmeceuticos}"}, 200

    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@farmaceutico_routes.route("/read-id", methods=["POST"])
def read_farmaceuticos_id():
    db = SessionLocal()
    try:
        data = request.json
        row_id = data.get("id")
        if not row_id:
            raise HTTPException(status_code=400, detail="ID is required")
        
        row = db.query(Farmaceutico).filter(Farmaceutico.id == row_id).first()
        farmaceutico = {
            "id": row.id,
            "nome": row.nome            
        }
        
        if not farmaceutico:
            raise HTTPException(status_code=404, detail=f"Farmaceutico com ID {farmaceutico} não encontrado")
        return {"message": "Farmaceutico Lido", "Farmaceutico": f"{farmaceutico}"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()
    