from flask import Blueprint, request, jsonify
import json
from pontos.carregar_medicamentos import carregar_medicamentos

bin_bp = Blueprint('bin', __name__)

@bin_bp.route("/visualizar", methods=["GET"])
def visualizar_bins():
    medicamentos = carregar_medicamentos()
    return jsonify({"bins": medicamentos}), 200

@bin_bp.route("/adicionar", methods=["POST"])
def adicionar_medicamento():
    novo_medicamento = request.json
    
    if "medicamento" not in novo_medicamento or "pontos" not in novo_medicamento:
        return jsonify({"erro": "Formato inválido"}), 400
    
    if novo_medicamento["medicamento"] <= 5:
        return jsonify({"erro": "IDs 1-5 são reservados"}), 400
    
    medicamentos = carregar_medicamentos()
    ids_existentes = [m["medicamento"] for m in medicamentos]
    
    if novo_medicamento["medicamento"] in ids_existentes:
        return jsonify({"erro": "ID já existe"}), 400
    
    medicamentos.append(novo_medicamento)
    
    with open("pontos/pontos.json", "w") as f:
        json.dump({"medicamentos": medicamentos}, f, indent=4)
    
    return jsonify({"mensagem": "Medicamento adicionado"}), 201

@bin_bp.route("/remover/<int:id_medicamento>", methods=["POST"])
def remover_medicamento(id_medicamento):
    if id_medicamento <= 5:
        return jsonify({"erro": "IDs 1-5 não podem ser removidos"}), 400
    
    medicamentos = carregar_medicamentos()
    
    index = next((i for i, m in enumerate(medicamentos) if m["medicamento"] == id_medicamento), None)
    
    if index is None:
        return jsonify({"erro": "Medicamento não encontrado"}), 404
    
    del medicamentos[index]
    
    with open("pontos/pontos.json", "w") as f:
        json.dump({"medicamentos": medicamentos}, f, indent=4)
    
    return jsonify({"mensagem": f"Medicamento {id_medicamento} removido"}), 200