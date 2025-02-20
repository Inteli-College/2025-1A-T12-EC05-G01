import sys
import os

# Garante que o Python reconheça os módulos corretamente
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'database')))

from models.paciente import Paciente

# Teste de adição de paciente (não adicionar hc duplicado)
Paciente.adicionar_paciente("brunao", "B1111", "HC001")
Paciente.adicionar_paciente("davi abreu", "A1111", "HC002")

# Listar pacientes
pacientes = Paciente.listar_pacientes()
for paciente in pacientes:
    print(dict(paciente))
