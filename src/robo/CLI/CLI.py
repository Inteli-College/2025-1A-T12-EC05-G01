from pontos.carregar_medicamentos import carregar_medicamentos
from CLI.utils import handle_acao
from typing import List, Optional

from SerialPortFinder.SerialPortFinder import SerialPortFinder 
from DobotConnectionHandler.DobotConnectionHandler import DobotConnectionHandler
from PortTester.PortTester import PortTester
from UserInterfaceHandler.UserInterfaceHandler import UserInterfaceHandler
def main():
    # Carregar medicamentos
    medicamentos = carregar_medicamentos()
    if not medicamentos:
        return

    # Encontrar portas seriais
    ports = SerialPortFinder.find_available_ports()
    if not ports:
        return

    # Seleção de porta
    selected_port = UserInterfaceHandler.select_port(ports)
    
    # Gerenciador de conexão
    connection_handler = DobotConnectionHandler()
    porta = None

    # Modo de detecção automática
    if selected_port == "Não sei a porta do Dobot":
        porta = DobotAutoDetector.detect(ports)
        if not porta:
            UserInterfaceHandler.show_error("Nenhum Dobot detectado. Verifique a conexão.")
            return
    else:
        porta = selected_port

    # Conexão final
    with UserInterfaceHandler.show_spinner("Conectando ao Dobot...") as spinner:
        if not connection_handler.connect(porta):
            spinner.fail("❌ Falha na conexão")
            return
        spinner.ok("✔ Conectado com sucesso!")

    # Inicialização
    connection_handler.initialize_robot()
    
    # Executar ações
    handle_acao(connection_handler.robot, medicamentos)

if __name__ == "__main__":
    main()
