import time
import sys
import serial.tools.list_ports
from yaspin import yaspin, Spinner
from sensores.sensor_qr.leitor import SerialDevice
from base_scanner.configuracoes import SCAN_INTERVAL, SERIAL_PORT, SERIAL_BAUDRATE
from .qr_code_ports import list_available_ports, select_port

def conectar_qr_code():
    # Configuração do spinner
    spinner = Spinner([
        "∙∙∙",
        "●∙∙",
        "∙●∙",
        "∙∙●",
        "∙∙∙"
    ], 200)

    with yaspin(spinner, text="Iniciando conexão com leitor QR", color="cyan") as sp:
        try:
            sp.text = "Procurando portas seriais"
            ports = list_available_ports()
            
            sp.text = "Selecionando porta de comunicação"
            porta = select_port(ports)
            
            if not porta:
                raise Exception("Nenhuma porta válida selecionada")
            
            sp.text = f"Conectando na porta {porta}"
            qr_reader = SerialDevice(port=porta, baudrate=SERIAL_BAUDRATE)  # Corrigido aqui
            
            sp.text = "Configurando parâmetros do leitor"
            qr_reader.configure_device()
            
            sp.ok("✅ ")
            print(f"\nConexão estabelecida com sucesso!")
            print(f"Porta: {qr_reader.port}")
            print(f"Baudrate: {qr_reader.baudrate}")
            
            return qr_reader

        except Exception as e:
            sp.fail("❌ ")
            print(f"\nFalha na conexão: {str(e)}")
            raise