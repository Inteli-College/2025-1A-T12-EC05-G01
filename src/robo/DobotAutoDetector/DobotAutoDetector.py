from typing import Optional, List
from UserInterfaceHandler.UserInterfaceHandler import UserInterfaceHandler
from PortTester.PortTester import PortTester

class DobotAutoDetector:
    """
    Essa classe é resposável por detectar automaticamente 
    a porta em que o Dobot está conectado. Utiliza o UserInterfaceHandler
    para mostrar informações na CLI e o PortTester para verificar se o 
    Dobot se conecta nas portas disponíveis, que são passadas como parâmetro
    """
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


