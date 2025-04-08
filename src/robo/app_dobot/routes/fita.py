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

def publicar_acao_mqtt(acao, detalhes=None, topico='dobot/acoes'):
    """Publica uma ação do Dobot via MQTT com estrutura JSON"""
    if detalhes is None:
        detalhes = {}
    payload = {
        "acao": acao,
        "timestamp": datetime.now().isoformat(),
        "detalhes": detalhes
    }
    current_app.mqtt.publish(topico, json.dumps(payload), retain=False)

@fita_bp.route("/bulk_adicionar", methods=["POST"])
def bulk_adicionar():
    """
    Recebe um JSON com mapeamento medicamento->quantidade e adiciona todos na fita.
    Exemplo de body: { "med1": 2, "med2": 1 }
    """
    global fita

    # Tenta extrair o JSON do corpo da requisição
    try:
        dados = request.get_json(force=True)
        if not isinstance(dados, dict):
            raise ValueError
    except Exception:
        return jsonify({
            "status": "error",
            "message": "JSON inválido. Deve ser um objeto mapeando medicamento->quantidade."
        }), 400

    # Para cada par medicamento->quantidade no JSON, converte e adiciona
    for med, qtd in dados.items():
        try:
            qtd_int = int(qtd)
        except (ValueError, TypeError):
            return jsonify({
                "status": "error",
                "message": f"Quantidade para '{med}' deve ser um número inteiro."
            }), 400

        if med not in fita:
            fita[med] = qtd_int
        else:
            fita[med] += qtd_int

        # Publica ação individualmente (opcional)
        publicar_acao_mqtt(
            "medicamento_adicionado",
            {"medicamento": med, "quantidade": qtd_int}
        )

    # Log único de bulk
    data = {
        "level": "INFO",
        "origin": "sistema",
        "action": "BULK_ADD_MEDICATION",
        "description": f"Added bulk medications: {dados}",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({
        "status": "success",
        "message": "Medicamentos adicionados em bulk com sucesso.",
        "fita": fita
    }), 200

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

    # Corrigido: Passa detalhes como dicionário
    publicar_acao_mqtt(
        "medicamento_adicionado",
        {"medicamento": medicamento, "quantidade": quantidade}
    )

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

    # Corrigido: Mantém a ordem correta dos parâmetros
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