from flask import Blueprint, jsonify, request, current_app
import requests
from datetime import datetime
import json
from ..functions.montar_fita import finalizar_montagem
from pontos.carregar_medicamentos import carregar_medicamentos

medicamentos = carregar_medicamentos()

fita_bp = Blueprint('fita', __name__)
DATABASE_URL = "http://127.0.0.1:3000"
fita = {}

def publicar_acao_mqtt(acao, topico='dobot/acoes' ,detalhes=None):
    """Publica uma ação do Dobot via MQTT com estrutura JSON"""
    if detalhes is None:
        detalhes = {}
    payload = {
        "acao": acao,
        "timestamp": datetime.now().isoformat(),
        "detalhes": detalhes
    }
    current_app.mqtt.publish(topico, json.dumps(payload), retain=True)

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

    # Publica via MQTT
    publicar_acao_mqtt("medicamento_adicionado", 
                      f"{quantidade}x {medicamento}")

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
    
    # Publica via MQTT
    publicar_acao_mqtt("montagem_cancelada")

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

    publicar_acao_mqtt("inicio_montagem", {"etapa": "inicio"})

    # Callback aprimorado para capturar todos os estágios
    resultado = finalizar_montagem(
        dobot,
        medicamentos,
        fita,
        callback=lambda acao, detalhes: publicar_acao_mqtt(acao, detalhes)
    )

    publicar_acao_mqtt("fim_montagem", resultado)

    data = {
        "level": "INFO",
        "origin": "sistema",
        "action": "FINALIZAR_MONTAGEM",
        "description": "Montagem da fita concluída.",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    fita.clear()

    return jsonify(resultado), 200

@fita_bp.route("/visualizar", methods=["GET"])
def visualizar_fita():
    global fita
    return jsonify({"status": "success", "fita": fita}), 200
