def list_available_ports():
    ports = list(serial.tools.list_ports.comports())
    if not ports:
        print("Nenhuma porta serial encontrada!")
        return []
    
    print("\nPortas seriais disponíveis:")
    for i, port in enumerate(ports):
        print(f"[{i}] {port.device} - {port.description}")
    
    return [port.device for port in ports]

def select_port(available_ports):
    if not available_ports:
        print(f"Usando porta padrão: {SERIAL_PORT}")
        return SERIAL_PORT
        
    print(f"\nPorta padrão nas configurações: {SERIAL_PORT}")
    choice = input("Selecione o número da porta ou pressione ENTER para usar a padrão: ")
    
    if choice.strip() == "":
        return SERIAL_PORT
    
    try:
        index = int(choice)
        if 0 <= index < len(available_ports):
            return available_ports[index]
        else:
            print("Índice inválido. Usando porta padrão.")
            return SERIAL_PORT
    except ValueError:
        print("Entrada inválida. Usando porta padrão.")
        return SERIAL_PORT