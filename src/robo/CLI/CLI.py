from pontos.carregar_medicamentos import carregar_medicamentos
from CLI.utils import handle_acao
from SerialPortFinder.SerialPortFinder import SerialPortFinder 
from DobotConnectionHandler.DobotConnectionHandler import DobotConnectionHandler
from UserInterfaceHandler.UserInterfaceHandler import UserInterfaceHandler
from DobotAutoDetector.DobotAutoDetector import DobotAutoDetector

def main():
    # Carrega os medicamentos
    medicamentos = carregar_medicamentos()
    if not medicamentos:
        return

    # Encontrar todas as portas seriais disponíveis no PC
    ports = SerialPortFinder.find_available_ports()
    if not ports:
        return

    # UserInterfaceHandler é responsável por lidar com as opções da CLI, 
    # basicamente encapsulando a biblioteca inquirer.
    # Aqui, o método select_port pede para o usuário escolher 
    # em qual porta o Dobot está conectado
    selected_port = UserInterfaceHandler.select_port(ports)
    
    # DobotConnectionHandler é o responsável por conectar o
    # robô à porta serial. Achei interessante separar essa
    # responsabilidade para poder re-utilizar no futuro (web)
    connection_handler = DobotConnectionHandler()
    porta = None

    # Adicionado para caso o usuário não saiba onde o robô está
    if selected_port == "Não sei a porta do Dobot":
        # DobotAutoDetector é o responsável por testar todas as portas e 
        # ver se o robô se conecta em alguma delas. Se sim, retorna a porta
        porta = DobotAutoDetector.detect(ports)
        if not porta:
            UserInterfaceHandler.show_error("Nenhum Dobot detectado. Verifique a conexão.")
            return
    else:
        porta = selected_port

    # Conexão final
    with UserInterfaceHandler.show_spinner("Conectando ao Dobot...") as spinner:
        # Aqui, a própria chamada do método já realiza a conexão. Se a conexão 
        # for bem sucedida, o método retorna True. Se retornar False, o programa
        # é interrompido por não conseguir se conectar à porta.
        if not connection_handler.connect(porta):
            spinner.fail("❌ Falha na conexão")
            return
        spinner.ok("✔ Conectado com sucesso!")

    # Inicialização do robô (leva para a home, limpa alarmes)
    connection_handler.initialize_robot()
    
    # Roda em loop, pedindo um prompt ou ação do usuário
    # Quando o usuário seleciona uma ação, também é responsável por
    # chamar o método/service adequado para realizar tal ação
    handle_acao(connection_handler.robot, medicamentos)

if __name__ == "__main__":
    main()
