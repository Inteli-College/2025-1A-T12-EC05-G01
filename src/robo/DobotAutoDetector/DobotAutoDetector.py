from typing import Optional, List
from UserInterfaceHandler.UserInterfaceHandler import UserInterfaceHandler
from PortTester.PortTester import PortTester

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


