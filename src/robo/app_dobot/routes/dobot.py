from flask import Blueprint, jsonify, request, current_app
import requests
from ..functions.executar_rotina import executar_rotina_medicamento
from pontos.carregar_medicamentos import carregar_medicamentos
from ..functions.device_initializer import inicializar_dispositivos

dobot_bp = Blueprint('dobot', __name__)
DATABASE_URL = "http://127.0.0.1:3000"
medicamentos = carregar_medicamentos()

@dobot_bp.route("/home", methods=["GET"])
def move_home():
    dobot = current_app.config.get('DOBOT')  
    if not dobot:
        return jsonify({"error": "Dobot não inicializado"}), 500
    
    dobot.home()
    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description":"Moved to home position",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"message": "Moved to home position"}), 200

@dobot_bp.route("/suction/<state>", methods=["POST"])
def suction(state):
    dobot = current_app.config.get('DOBOT') 
    if not dobot:
        return jsonify({"error": "Dobot não inicializado"}), 500
    
    if state not in ("on", "off"):
        return jsonify({"error": "Invalid state"}), 400
    
    try: 
        if state == "on":
            dobot.suck(True)
        else:
            dobot.suck(False)
            
        data = {
            "level":"INFO",
            "origin":"sistema",
            "action":"STARTUP",
            "description":f"Suction turned {state}",
            "status": "SUCCESS"
        }
        requests.post(f"{DATABASE_URL}/logs/create", json=data)
        return jsonify({"message": f"Suction turned {state}"}), 200
    except Exception as e:
        data = {
            "level":"ERROR",
            "origin":"sistema",
            "action":"STARTUP",
            "description":f"Failed to turn suction {state}",
            "status": "FAILED"
        }
        requests.post(f"{DATABASE_URL}/logs/create", json=data)
        return jsonify({"error": f"Failed to turn suction {state}"}), 422
    

@dobot_bp.route("/move", methods=["POST"])
def move():
    dobot = current_app.config.get('DOBOT') 
    if not dobot:
        return jsonify({"error": "Dobot não inicializado"}), 500
    
    data = request.json
    x = data.get("x")
    y = data.get("y")
    z = data.get("z")
    r = data.get("r")

    if None in (x, y, z, r):
        return jsonify({"error": "Missing parameters"}), 400
    
    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description":f"Moved to ({x}, {y}, {z})",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"message": f"Moved to ({x}, {y}, {z})"}), 200
    
@dobot_bp.route("/medicamento/<medicamento>")
def rotina_medicamento(medicamento):
    dobot = current_app.config.get('DOBOT')  
    if not dobot:
        return jsonify({"error": "Dobot não inicializado"}), 500
    
    medicamentos = carregar_medicamentos()
    
    if executar_rotina_medicamento(dobot, medicamento, medicamentos) == False:

       # Enviar logs para o banco
        data = {
            "level":"INFO",
            "origin":"sistema",
            "action":"STARTUP",
            "description": f"Falha ao executar a rotina para o medicamento {medicamento}",
            "status": "FAILED"
        }
        requests.post(f"{DATABASE_URL}/logs/create", json=data)
        return {"message": "Falha ao executar a rotina"}, 422
    
    dobot.home()

    # Enviar logs para o banco
    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": f"Rotina executada para o medicamento {medicamento}",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return {"message": "Rotina executada com sucesso"}, 200

@dobot_bp.route("/limpar-todos-alarmes")
def limpar_alarmes():
    dobot = current_app.config.get('DOBOT')  # Obter do contexto
    if not dobot:
        return jsonify({"error": "Dobot não inicializado"}), 500
    
    dobot.get_alarm_state()
    dobot.clear_all_alarms()

    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": "Alarmes removidos.",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return {"message": "Alarmes removidos"}, 200

@dobot_bp.route("/posicao", methods=["GET"])
def posicao_atual():
    dobot = current_app.config.get('DOBOT')  # Obter do contexto
    if not dobot:
        return jsonify({"error": "Dobot não inicializado"}), 500
    
    x, y, z, r, *_ = dobot.pose()

    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": f"Posição verificada: ({x}, {y}, {z}, {r})",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"message": "`Pontos retornados", "pontos": {"x": x, "y": y, "z": z, "r": r}}), 200  

@dobot_bp.route("/reconectar", methods=["GET"])
def reconectar_dobot():
    dobot = current_app.config.get('DOBOT')
    if dobot is not None:
        return jsonify({"message": "Dobot ja esta conectado"}), 200
    try:
        result = inicializar_dispositivos(current_app)
        if result is None:
            return jsonify({"message": "Falha ao reconectar Dobot"}), 422
            
        return jsonify({"message": "Dobot reconectado com sucesso"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Erro na reconexão: {str(e)}")
        return jsonify({"message": "Erro interno na reconexão"}), 500
    
    
