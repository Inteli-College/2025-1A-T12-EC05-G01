from flask import request, Blueprint, jsonify
from fastapi import HTTPException
from sqlalchemy import func
from software.database.db_conexao import engine, Base, get_db, SessionLocal
from ...models.estoque import Estoque
from ...models.medicamento import Medicamento
from ...models.quantidade_bin import QuantidadeBin  

estoque_routes = Blueprint('estoque', __name__, url_prefix="/estoque")

@estoque_routes.route("/create", methods=["POST"])
def create_estoque():
    db = SessionLocal()
    try:
        estoque = Estoque(
            id_medicamento=request.json.get("id_medicamento"),
            lote=request.json.get("lote"),
            quantidade=request.json.get("quantidade"),
            validade=request.json.get("validade"),
            bin=request.json.get("bin"),
            fornecedor=request.json.get("fornecedor")
        )
        db.add(estoque)
        db.commit()
        return {"message": "Novo estoque salvo"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@estoque_routes.route("/delete", methods=["DELETE"])
def delete_estoque():
    db = SessionLocal()
    try:
        estoque_id = request.args.get("id")
        if not estoque_id:
            raise HTTPException(status_code=400, detail="ID is required")

        estoque_to_delete = db.query(Estoque).filter(Estoque.id == estoque_id).first()
        if not estoque_to_delete:
            raise HTTPException(status_code=404, detail=f"Estoque com ID {estoque_id} não encontrado")
        
        db.delete(estoque_to_delete)
        db.commit()
        return {"message": f"Linha {estoque_id} deletado do banco"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@estoque_routes.route("/update", methods=["PUT"])
def update_estoque():
    db = SessionLocal()
    try:
        data = request.json
        estoque_id = data.get("id")
        if not estoque_id:
            raise HTTPException(status_code=400, detail="ID is required")

        estoque_to_update = db.query(Estoque).filter(Estoque.id == estoque_id).first()
        if not estoque_to_update:
            raise HTTPException(status_code=404, detail=f"Estoque com ID {estoque_id} não encontrado")

        estoque_to_update.id_medicamento = data.get("id_medicamento", estoque_to_update.id_medicamento)
        estoque_to_update.lote = data.get("lote", estoque_to_update.lote)
        estoque_to_update.quantidade = data.get("quantidade", estoque_to_update.quantidade)
        estoque_to_update.validade = data.get("validade", estoque_to_update.validade)
        estoque_to_update.bin = data.get("bin", estoque_to_update.bin)
        estoque_to_update.fornecedor = data.get("fornecedor", estoque_to_update.fornecedor)

        db.commit()
        return {"message": f"Estoque {estoque_id} updated successfully"}, 200
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@estoque_routes.route("/read-all", methods=["GET", "POST"])
def read_all_estoque():
    db = SessionLocal()
    try:
        if request.method == "GET":
            estoque = db.query(Estoque).all()
            
            if not estoque:
                return {"message": "No rows found"}, 200

            estoque = [{
                "id": row.id,
                "id_medicamento": row.id_medicamento,
                "lote": row.lote,
                "quantidade": row.quantidade,
                "validade": row.validade,
                "bin": row.bin,
                "fornecedor": row.fornecedor
            } for row in estoque]
            
            return {"estoque": estoque}, 200

        elif request.method == "POST":
            data = request.json

            id_medicamento = data.get("id_medicamento")
            lote = data.get("lote")
            quantidade = data.get("quantidade")
            validade = data.get("validade")
            bin = data.get("bin")
            fornecedor = data.get("fornecedor")

            query = db.query(Estoque)
            if id_medicamento:
                query = query.filter(Estoque.id_medicamento == id_medicamento)
            if lote:
                query = query.filter(Estoque.lote == lote)
            if quantidade:
                query = query.filter(Estoque.quantidade == quantidade)
            if validade:
                query = query.filter(Estoque.validade == validade)
            if bin:
                query = query.filter(Estoque.bin == bin)
            if fornecedor:
                query = query.filter(Estoque.fornecedor == fornecedor)
            
            estoque = query.all()
            
            if not estoque:
                return {"message": "No rows found with the provided filters"}, 200
            
            estoque = [{
                "id": row.id,
                "id_medicamento": row.id_medicamento,
                "lote": row.lote,
                "quantidade": row.quantidade,
                "validade": row.validade,
                "bin": row.bin,
                "fornecedor": row.fornecedor,
                "medicamento": row.medicamento
            } for row in estoque]
            
            return {"estoque": f"{estoque}"}, 200

    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@estoque_routes.route("/read-id", methods=["POST"])
def read_estoque_id():
    db = SessionLocal()
    try:
        data = request.json
        row_id = data.get("id")
        if not row_id:
            raise HTTPException(status_code=400, detail="ID is required")
        
        row = db.query(Estoque).filter(Estoque.id == row_id).first()
        estoque = {
            "id": row.id,
            "id_medicamento": row.id_medicamento,
            "lote": row.lote,
            "quantidade": row.quantidade,
            "validade": row.validade,
            "bin": row.bin,
            "fornecedor": row.fornecedor,
            "medicamento": row.medicamento
        }
        
        if not estoque:
            raise HTTPException(status_code=404, detail=f"Estoque com ID {estoque} não encontrado")
        return {"message": "Estoque Lido", "Estoque": f"{estoque}"}, 200
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@estoque_routes.route("/bin-quantidade/read", methods=["GET"])
def read_quantidade_por_bin():
    db = SessionLocal()
    try:
        resultados = db.query(
            Estoque.bin,
            Medicamento.nome.label("medicamento_nome"),
            func.sum(Estoque.quantidade).label("quantidade_total")
        ).join(Medicamento, Medicamento.id == Estoque.id_medicamento
        ).group_by(Estoque.bin, Medicamento.nome).all()

        if not resultados:
            return {"message": "Nenhum resultado encontrado"}, 200

        dados = [{
            "bin": r.bin,
            "medicamento": r.medicamento_nome,
            "quantidade": r.quantidade_total
        } for r in resultados]

        return jsonify(dados), 200

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()