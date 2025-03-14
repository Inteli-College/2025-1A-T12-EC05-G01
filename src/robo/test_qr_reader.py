import time
import logging
import sys
import serial.tools.list_ports
from robo.sensores.sensor_qr.leitor import SerialDevice
from robo.base_scanner.configuracoes import SCAN_INTERVAL, SERIAL_PORT, SERIAL_BAUDRATE

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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

def main():
    print("\n=== TESTE DO LEITOR QR CODE (CONEXÃO DIRETA) ===")
    
    available_ports = list_available_ports()
    selected_port = select_port(available_ports)
    
    print(f"\nUtilizando porta: {selected_port}")
    print("Pressione Ctrl+C para sair")
    
    try:
        qr_reader = SerialDevice(port=selected_port, baudrate=SERIAL_BAUDRATE)
        print(f"Conectado na porta {qr_reader.port} com baudrate {qr_reader.baudrate}")
        
        qr_reader.configure_device()
        print("Leitor QR code configurado")
        
        qr_reader.start_scanning()
        print("Escaneamento iniciado. Aponte um QR code para o leitor...")
        
        while True:
            data = qr_reader.read_qr_code()
            if data:
                print("\n=== QR CODE DETECTADO ===")
                print(f"Conteúdo: {data['content']}")
                print(f"Timestamp: {data['timestamp']}")
                print("========================\n")
                
            time.sleep(SCAN_INTERVAL)
            
    except KeyboardInterrupt:
        print("\nPrograma interrompido pelo usuário.")
    except serial.SerialException as e:
        print(f"\nErro de conexão serial: {e}")
    except Exception as e:
        logger.error(f"Erro: {e}")
    finally:
        if 'qr_reader' in locals():
            try:
                qr_reader.stop_scanning()
                qr_reader.close()
                print("Conexão encerrada")
            except:
                pass

if __name__ == "__main__":
    main()