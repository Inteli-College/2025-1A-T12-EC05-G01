from flask import Flask, request, jsonify
from .config import Config
# from flask_mqtt import Mqtt
from pontos.carregar_medicamentos import carregar_medicamentos
from SerialPortFinder.SerialPortFinder import SerialPortFinder
from DobotConnectionHandler.DobotConnectionHandler import DobotConnectionHandler
from DobotAutoDetector.DobotAutoDetector import DobotAutoDetector
from .functions.executar_rotina import executar_rotina_medicamento
from .functions.montar_fita import montar_fita
app_dobot = Flask(__name__)

# app_dobot.config.from_object(Config)
# mqtt = Mqtt(app_dobot)

medicamentos = carregar_medicamentos()

fita = {}

dobot = None

ports = SerialPortFinder.find_available_ports()
port = DobotAutoDetector.detect(ports)
connection_handler = DobotConnectionHandler()
connection_handler.connect(port)
connection_handler.initialize_robot()
dobot = connection_handler.robot

@app_dobot.route("/dobot")
def initiate_dobot():
    ports = SerialPortFinder.find_available_ports()
    port = DobotAutoDetector.detect(ports)
    connection_handler = DobotConnectionHandler()
    connection_handler.connect(port)
    connection_handler.initialize_robot()
    dobot = connection_handler.robot
    return jsonify({"message": "Robo conectado"}), 200

@app_dobot.route("/dobot/home", methods=["GET"])
def move_home():
    dobot.home()
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

    return jsonify({"message": f"Moved to ({x}, {y}, {z})"}), 200

@app_dobot.route("/dobot/medicamento/<medicamento>")
def rotina_medicamento(medicamento):
    if executar_rotina_medicamento(dobot, medicamento, medicamentos) == False:
       return {"message": "Falha ao executar a rotina"}, 422
       ## O código 422 (Unprocessable Entity) indica que a requisição foi válida,
       ## mas não pôde ser processada corretamente pelo sistema.
    dobot.home()
    return {"message": "Rotina executada com sucesso"}, 200

@app_dobot.route("/dobot/limpar-todos-alarmes")
def limpar_alarmes():
    dobot.get_alarm_state()
    dobot.clear_all_alarms()
    return {"message": "Alarmes removidos"}, 200

@app_dobot.route("/dobot/posicao", methods=["GET"])
def posicao_atual():
    x, y, z, r, *_ = dobot.pose()
    return jsonify({"message": f"Posição atual: ({x}, {y}, {z}, {r})"}), 200    

@app_dobot.route("/dobot/fita/adicionar", methods=["POST"])
def adicionar_medicamento():
    data = request.json
    medicamento = data.get("medicamento")
    quantidade = data.get("quantidade")

    if not medicamento or not quantidade:
        return jsonify({"status": "erro", "mensagem": "Parâmetros 'medicamento' e 'quantidade' são obrigatórios"}), 400
    
    try:
        quantidade = int(quantidade)
    except ValueError:
        return jsonify({"status": "erro", "mensagem": "A quantidade deve ser um número inteiro"}), 400
    
    if medicamento not in fita:
        fita[medicamento] = quantidade 
    else:
        fita[medicamento] += quantidade 

    return jsonify({"status": "sucesso", "mensagem": f"Medicamento{medicamento} adicionado à fita", "fita": fita}), 200

@app_dobot.route("/dobot/fita/montar", methods=["POST"])
def realizar_montagem():
    resultado = montar_fita(dobot, medicamentos, fita)
    return jsonify(resultado), 200

@app_dobot.route("/dobot/fita/cancelar", methods=["POST"])
def cancelar_montagem():
    global fita
    fita = {}  # Limpa a fita
    return jsonify({"status": "sucesso", "mensagem": "Montagem da fita cancelada."}), 200


if __name__ == "__main__":
    app_dobot.run(host="0.0.0.0", port=5000, debug=True)