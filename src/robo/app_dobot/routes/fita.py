from flask import Blueprint, jsonify, request, current_app
import requests
from ..functions.montar_fita import finalizar_montagem
from pontos.carregar_medicamentos import carregar_medicamentos

medicamentos = carregar_medicamentos()

dobot_bp = Blueprint('dobot', __name__)
fita_bp = Blueprint('fita', __name__)
DATABASE_URL = "http://127.0.0.1:3000"
fita = {}  

@fita_bp.route("/adicionar/<medicamento>/<quantidade>", methods=["POST"])
def adicionar_medicamento(medicamento, quantidade):
    
    global fita 
    
    try:
        quantidade = int(quantidade)
    except ValueError:
        return jsonify({"status": "error", "message": "Quantidade deve ser um número inteiro"}), 400

    if medicamento not in fita:
        fita[medicamento] = quantidade
    else:
        fita[medicamento] += quantidade


    data = {
        "level": "INFO",
        "origin": "sistema",
        "action": "ADD_MEDICATION",
        "description": f"Added {quantidade} of {medicamento} to fita.",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"status": "success", "message": f"Medicamento {medicamento} adicionado a fita", "fita": fita}), 200

@fita_bp.route("/cancelar", methods=["POST"])
def cancelar_montagem():

    global fita

    fita.clear()

    data = {
        "level": "INFO",
        "origin": "sistema",
        "action": "CANCELAR_MONTAGEM",
        "description": "Montagem da fita cancelada.",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"status": "success", "message": "Montagem da fita cancelada"}), 200


@fita_bp.route("/finalizar", methods=["POST"])
def finalizar_montagem_endpoint():

    dobot = current_app.config.get('DOBOT')  
    if not dobot:
        return jsonify({"error": "Dobot não inicializado"}), 500

    if dobot is None:
        return jsonify({"status": "error", "message": "Robot not initialized"}), 400

    resultado = finalizar_montagem(dobot, medicamentos, fita)

    data = {
        "level": "INFO",
        "origin": "sistema",
        "action": "FINALIZAR_MONTAGEM",
        "description": "Montagem da fita concluída.",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify(resultado), 200

@fita_bp.route("/visualizar", methods=["GET"])
def visualizar_fita():

    global fita 

    return jsonify({"status": "success", "fita": fita}), 200