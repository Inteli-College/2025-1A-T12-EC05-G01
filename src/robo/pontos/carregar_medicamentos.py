import json
import os
from .fixos import FIXOS


def carregar_medicamentos():
    caminho_arquivo = "pontos/pontos.json"
    
    # Se o arquivo não existe, cria com os fixos
    if not os.path.exists(caminho_arquivo):
        with open(caminho_arquivo, "w") as f:
            json.dump({"medicamentos": FIXOS}, f, indent=4)
        return FIXOS.copy()

    # Carrega medicamentos do arquivo
    with open(caminho_arquivo, "r") as f:
        dados = json.load(f)
        medicamentos_arquivo = dados["medicamentos"]

    # Verifica e corrige os fixos
    precisa_salvar = False
    for i in range(5):
        if i >= len(medicamentos_arquivo) or medicamentos_arquivo[i] != FIXOS[i]:
            precisa_salvar = True
            break

    if precisa_salvar:
        # Mantém personalizados existentes (ID > 5)
        personalizados = [m for m in medicamentos_arquivo if m["medicamento"] > 5]
        novos_medicamentos = FIXOS.copy() + personalizados
        
        with open(caminho_arquivo, "w") as f:
            json.dump({"medicamentos": novos_medicamentos}, f, indent=4)
        
        return novos_medicamentos
    else:
        return medicamentos_arquivo