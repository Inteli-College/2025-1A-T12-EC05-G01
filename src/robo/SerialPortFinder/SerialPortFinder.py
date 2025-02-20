from typing import List
from yaspin import yaspin
from serial.tools import list_ports

class SerialPortFinder:
    @staticmethod
    def find_available_ports() -> List[str]:
        """Responsável por encontrar portas seriais disponíveis"""
        with yaspin(text="Buscando portas seriais...", color="green") as spinner:
            ports = [p.device for p in list_ports.comports()]
            if not ports:
                spinner.fail("❌ Nenhuma porta serial encontrada!")
                return []
            spinner.ok("✔ Portas encontradas!")
            return ports


