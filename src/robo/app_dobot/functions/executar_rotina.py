import smbus
import time
import serial
import logging
from base_scanner.configuracoes import SCAN_INTERVAL
import sys
import serial.tools.list_ports
from base_scanner.configuracoes import SCAN_INTERVAL, SERIAL_PORT, SERIAL_BAUDRATE
from sensores.sensor_qr.leitor import SerialDevice

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

# Configuração de logging
logger = logging.getLogger(__name__)

SLAVE_ADDRESS = 8       # Endereço do Arduino no barramento I2C
bus = smbus.SMBus(1)    # Utiliza o barramento I2C 1 (padrão no Raspberry Pi)

def executar_rotina_medicamento(robo, medicamento, medicamentos, delta_z=0, tentativas=0, max_tentativas=3):
    if isinstance(medicamento, str):
        medicamento = int(medicamento[-1])
        
    if tentativas >= max_tentativas:
        logger.error(f"Máximo de {max_tentativas} tentativas atingido. Abortando a operação.")
        robo.home()
        return False

    # Configurar velocidade padrão
    robo.set_speed(200, 200)
    robo.home()
    
    for i in range(len(medicamentos[medicamento - 1]['pontos'])):
        pontos_medicamento = medicamentos[medicamento - 1]['pontos'][i]  
        if i < len(medicamentos[medicamento - 1]['pontos']) - 1:
            prox_ponto = medicamentos[medicamento - 1]['pontos'][i + 1]
        if i < len(medicamentos[medicamento - 1]['pontos']) - 2:
            prox_prox_ponto = medicamentos[medicamento - 1]['pontos'][i + 2]
        
        x = float(pontos_medicamento['x'])
        y = float(pontos_medicamento['y'])  
        
        if (i == len(medicamentos[medicamento - 1]['pontos']) - 2) or (i == len(medicamentos[medicamento - 1]['pontos']) - 1):
            z = float(pontos_medicamento['z']) + delta_z
        else:
            z = float(pontos_medicamento['z'])

        r = float(pontos_medicamento['r'])
        
        if pontos_medicamento['movimento'] == 'movj':
            robo.movej_to(x, y, z, r, wait=True)
        elif pontos_medicamento['movimento'] == 'movl':
            robo.movel_to(x, y, z, r, wait=True)
            
        # Lógica modificada para leitura de QR code
        if prox_ponto['suctionCup'].lower() == 'off' and prox_prox_ponto['suctionCup'].lower() == 'on':
            #available_ports = list_available_ports()
            #selected_port = select_port(available_ports)

            try:
                qr_reader = SerialDevice(port=SERIAL_PORT, baudrate=SERIAL_BAUDRATE)
                print(f"Conectado na porta {qr_reader.port} com baudrate {qr_reader.baudrate}")
                #qr_reader.configure_device()
                qr_reader.start_scanning()
                print("Aguardando leitura do QR code...")

                qr_detectado = False
                while not qr_detectado:
                    data = qr_reader.read_qr_code()
                    if data:
                        print("\n=== QR CODE DETECTADO ===")
                        print(f"Conteúdo: {data['content']}")
                        print(f"Timestamp: {data['timestamp']}")
                        print("========================")
                        qr_detectado = True  # Sair do loop após detecção
                    
                    ##time.sleep(SCAN_INTERVAL)

            except Exception as e:
                print(f"Erro: {e}")
                return False
            
            finally:
                if 'qr_reader' in locals():
                    try:
                        qr_reader.stop_scanning()
                        qr_reader.close()
                        print("Leitura concluída, continuando operação...")
                    except:
                        pass
            
        if pontos_medicamento['suctionCup'].lower() == 'on':
            robo.suck(True)            
            
            try:
                data = bus.read_i2c_block_data(SLAVE_ADDRESS, 0, 2)
                sensor_value = (data[0] << 8) | data[1]
                print(f"Valor do sensor: {sensor_value}")
                
                if sensor_value > 600:
                    logger.warning("Falha na pega do medicamento. Reiniciando rotina...")
                    robo.movel_to(x, y, 143.0, r, wait=True)
                    return executar_rotina_medicamento(
                        robo, medicamento, medicamentos,
                        delta_z=0, tentativas=tentativas+1, max_tentativas=max_tentativas
                    )
                    
            except Exception as e:
                logger.error(f"Erro na leitura do sensor: {e}")
                return False
                
        else:
            robo.suck(False)
    
    return True