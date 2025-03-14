from flask import Flask, request, jsonify
import requests, http
from .config import Config
from pontos.carregar_medicamentos import carregar_medicamentos
from SerialPortFinder.SerialPortFinder import SerialPortFinder
from DobotConnectionHandler.DobotConnectionHandler import DobotConnectionHandler
from DobotAutoDetector.DobotAutoDetector import DobotAutoDetector
from .functions.executar_rotina import executar_rotina_medicamento
from .functions.montar_fita import montar_fita
from .functions.conectar_qr_code import conectar_qr_code
import os
import time
import time
import logging
import sys
import serial.tools.list_ports
from sensores.sensor_qr.leitor import SerialDevice
from base_scanner.configuracoes import SCAN_INTERVAL, SERIAL_PORT, SERIAL_BAUDRATE

app_dobot = Flask(__name__)

DATABASE_URL = "http://127.0.0.1:3000"

# Configurações iniciais
medicamentos = carregar_medicamentos()
fita = {}
dobot = None

def inicializar_dispositivos():
    global dobot, qr_reader
    
    # Verifica se já foi inicializado
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true' and app_dobot.debug:
        return

    print("\n=== INICIALIZAÇÃO DE DISPOSITIVOS ===")
    
    # Conectar QR Code
    ##print("\n[CONEXÃO QR CODE]")
    ##qr_reader = conectar_qr_code()
    ##time.sleep(2)
    
    # Conectar Dobot
    print("\n[CONEXÃO DOBOT]")
    ports = SerialPortFinder.find_available_ports()
    port = DobotAutoDetector.detect(ports)
    connection_handler = DobotConnectionHandler()
    connection_handler.connect(port)
    connection_handler.initialize_robot()
    dobot = connection_handler.robot
    print("=== DISPOSITIVOS INICIALIZADOS ===\n")

    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": "Dispositivos inicializados.",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

# Executa a inicialização apenas uma vez
if not app_dobot.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
    inicializar_dispositivos()
    

@app_dobot.route("/dobot/home", methods=["GET"])
def move_home():
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

@app_dobot.route("/dobot/move", methods=["POST"])
def move():
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

@app_dobot.route("/dobot/medicamento/<medicamento>")
def rotina_medicamento(medicamento):
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


@app_dobot.route("/dobot/limpar-todos-alarmes")
def limpar_alarmes():
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

@app_dobot.route("/dobot/posicao", methods=["GET"])
def posicao_atual():
    x, y, z, r, *_ = dobot.pose()

    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": f"Posição verificada: ({x}, {y}, {z}, {r})",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"message": f"Posição atual: ({x}, {y}, {z}, {r})"}), 200    

@app_dobot.route("/dobot/fita/adicionar", methods=["POST"])
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


@app_dobot.route("/dobot/fita/montar", methods=["POST"])
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

@app_dobot.route("/dobot/fita/cancelar", methods=["POST"])
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

if __name__ == "__main__":
    app_dobot.run(host="0.0.0.0", port=5000, debug=False)