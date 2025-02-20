from Dobot.Dobot import Dobot
from pontos.carregar_medicamentos import carregar_medicamentos
from CLI.utils import handle_acao
import inquirer
from yaspin import yaspin
from multiprocessing import Process, Queue
from typing import List, Optional

from SerialPortFinder.SerialPortFinder import SerialPortFinder 

class DobotConnectionHandler:
    def __init__(self):
        self.robot = None
        self.default_speed = (200, 200)

    def connect(self, port: str) -> bool:
        """Estabelece conexão com o Dobot"""
        try:
            self.robot = Dobot(port=port, verbose=False)
            self.robot.set_speed(*self.default_speed)
            return True
        except Exception:
            return False

    def initialize_robot(self) -> None:
        """Executa rotinas de inicialização do robô"""
        if self.robot:
            self.robot.home()
            self.robot.clear_all_alarms()

class PortTester:
    TIMEOUT = 5

    @staticmethod
    def test_port(port: str) -> Optional[str]:
        """Testa uma porta serial com timeout"""
        queue = Queue()
        process = Process(target=PortTester._test_connection, args=(port, queue))
        
        try:
            process.start()
            process.join(PortTester.TIMEOUT)
            
            if process.is_alive():
                process.terminate()
                process.join()
                return None
                
            result = queue.get_nowait()
            return result if isinstance(result, str) else None
            
        except Exception:
            return None

    @staticmethod
    def _test_connection(port: str, queue: Queue) -> None:
        """Método interno para teste de conexão"""
        try:
            robot = Dobot(port=port, verbose=False)
            robot.pose()
            robot.close()
            queue.put(port)
        except Exception as e:
            queue.put(e)

class UserInterfaceHandler:
    @staticmethod
    def select_port(ports: List[str]) -> str:
        """Exibe interface de seleção de portas"""
        options = ports + ["Não sei a porta do Dobot"]
        return inquirer.prompt([
            inquirer.List(
                'porta',
                message="Selecione a porta do Dobot",
                choices=options,
                carousel=True
            )
        ])['porta']

    @staticmethod
    def show_spinner(text: str, color: str = "green") -> yaspin:
        return yaspin(text=text, color=color)

    @staticmethod
    def show_error(message: str) -> None:
        print(f"\n❌ {message}")

class DobotAutoDetector:
    @staticmethod
    def detect(ports: List[str]) -> Optional[str]:
        """Executa detecção automática de portas"""
        for port in ports:
            with UserInterfaceHandler.show_spinner(f"Testando porta {port}...") as spinner:
                if PortTester.test_port(port):
                    spinner.ok(f"✔ Dobot encontrado na porta {port}!")
                    return port
                spinner.fail(f"❌ Porta {port} inválida")
        return None

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
