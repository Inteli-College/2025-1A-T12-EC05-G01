import time
import serial
import serial.tools.list_ports

def list_available_ports():
    ports = list(serial.tools.list_ports.comports())
    if not ports:
        print("Nenhuma porta serial encontrada!")
        return []
    
    print("\nPortas seriais disponíveis:")
    for i, port in enumerate(ports):
        print(f"[{i}] {port.device} - {port.description}")
    
    return ports

def select_port(available_ports):
    DEFAULT_PORT = '/dev/ttyUSB0'
    
    # Verifica se a porta padrão está na lista de portas disponíveis
    for port in available_ports:
        if port.device == DEFAULT_PORT:
            print(f"\nPorta padrão {DEFAULT_PORT} encontrada. Testando conexão...")
            try:
                # Tenta abrir a porta para verificar se está disponível
                ser = serial.Serial(DEFAULT_PORT, 9600, timeout=2)
                ser.close()
                print(f"Conexão com {DEFAULT_PORT} bem-sucedida.")
                return DEFAULT_PORT
            except Exception as e:
                print(f"Erro ao conectar com porta padrão: {e}")
                # Continua para a seleção manual ou outras portas
    
    # Se não encontrar a porta padrão ou falhar ao conectar
    if not available_ports:
        print("AVISO: Nenhuma porta disponível!")
        return None
    
    print(f"\nSelecione uma porta disponível:")
    for i, port in enumerate(available_ports):
        print(f"[{i}] {port.device} - {port.description}")
    
    choice = input("\nSelecione o número da porta ou pressione ENTER para tentar todas: ")
    
    if choice.strip() == "":
        # Tenta cada porta até encontrar uma que funcione
        for port in available_ports:
            try:
                print(f"Tentando porta {port.device}...")
                ser = serial.Serial(port.device, 9600, timeout=2)
                ser.close()
                print(f"Conexão com {port.device} bem-sucedida.")
                return port.device
            except Exception as e:
                print(f"Erro ao conectar com {port.device}: {e}")
        
        print("Não foi possível conectar a nenhuma porta disponível.")
        return None
    
    try:
        index = int(choice)
        if 0 <= index < len(available_ports):
            selected_port = available_ports[index].device
            try:
                ser = serial.Serial(selected_port, 9600, timeout=2)
                ser.close()
                print(f"Conexão com {selected_port} bem-sucedida.")
                return selected_port
            except Exception as e:
                print(f"Erro ao conectar com {selected_port}: {e}")
                return None
        else:
            print("Índice inválido.")
            return None
    except ValueError:
        print("Entrada inválida.")
        return None