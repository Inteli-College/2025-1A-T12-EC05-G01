from flask import Blueprint, jsonify, request
import requests

fita_bp = Blueprint('fita', __name__)
DATABASE_URL = "http://127.0.0.1:3000"
fita = {}  

@fita_bp.route("/adicionar", methods=["POST"])
def adicionar_medicamento():
    data = request.json
    medicamento = data.get("medicamento")
    quantidade = data.get("quantidade")

    if not medicamento or not quantidade:
        data = {
            "level":"INFO",
            "origin":"sistema",
            "action":"STARTUP",
            "description": "Parâmetros 'medicamento' e 'quantidade' são obrigatórios.",
            "status": "FAILED"
        }
        requests.post(f"{DATABASE_URL}/logs/create", json=data)
        return jsonify({"status": "erro", "mensagem": "Parâmetros 'medicamento' e 'quantidade' são obrigatórios"}), 400
    
    try:
        quantidade = int(quantidade)
    except ValueError:
        data = {
            "level":"INFO",
            "origin":"sistema",
            "action":"STARTUP",
            "description": "A quantidade deve ser um número inteiro.",
            "status": "FAILED"
        }
        requests.post(f"{DATABASE_URL}/logs/create", json=data)
        return jsonify({"status": "erro", "mensagem": "A quantidade deve ser um número inteiro"}), 400
    
    if medicamento not in fita:
        fita[medicamento] = quantidade 
    else:
        fita[medicamento] += quantidade 

    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": f"Medicamento{medicamento} adicionado à fita: {fita}",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"status": "sucesso", "mensagem": f"Medicamento {medicamento} adicionado à fita", "fita": fita}), 200


@fita_bp.route("/montar", methods=["POST"])
def realizar_montagem():
    resultado = montar_fita(dobot, medicamentos, fita)

    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": "Montagem da fita concluída",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify(resultado), 200

@fita_bp.route("/cancelar", methods=["POST"])
def cancelar_montagem():
    global fita
    fita = {}  # Limpa a fita

    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": "Montagem da fita cancelada",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"status": "sucesso", "mensagem": "Montagem da fita cancelada."}), 200