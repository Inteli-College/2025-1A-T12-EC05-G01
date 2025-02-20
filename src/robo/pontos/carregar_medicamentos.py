import json

def carregar_medicamentos(arquivo='pontos/pontos.json'): ## Caminho relativo à pasta robo
    """Carrega os medicamentos e seus pontos do arquivo JSON"""
    try:
        with open(arquivo, 'r') as f:
            dados = json.load(f)
            return dados['medicamentos']
    except FileNotFoundError:
        print(f"Erro: Arquivo {arquivo} não encontrado!")
        return None
    except json.JSONDecodeError:
        print(f"Erro: Formato inválido no arquivo {arquivo}!")
        return None
    except KeyError:
        print("Erro: Estrutura do JSON inválida!")
        return None

 
