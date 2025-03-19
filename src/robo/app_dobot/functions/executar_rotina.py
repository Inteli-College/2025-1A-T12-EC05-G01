import smbus
import time
import serial
import logging
from base_scanner.configuracoes import SCAN_INTERVAL
import sys
import serial.tools.list_ports
from base_scanner.configuracoes import SCAN_INTERVAL, SERIAL_PORT, SERIAL_BAUDRATE
from sensores.sensor_qr.leitor import SerialDevice

from .qr_code_ports import list_available_ports, select_port


from ..SensorInfravermelho.SensorInfravermelho import SensorInfravermelho
sensor_infravermelho = SensorInfravermelho()

from ..LeitorQRCode.LeitorQRCode import LeitorQRCode

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
            
        # Lógica para leitura de QR code
        if prox_ponto['suctionCup'].lower() == 'off' and prox_prox_ponto['suctionCup'].lower() == 'on':
            try:
                with LeitorQRCode() as leitor:
                    leitor.iniciar_leitura()
                    print("Aguardando leitura do QR code...")
                    
                    qr_detectado = False
                    while not qr_detectado:
                        dados = leitor.ler_codigo()
                        if dados:
                            print("\n=== QR CODE DETECTADO ===")
                            print(f"Conteúdo: {dados['conteudo']}")
                            print(f"Timestamp: {dados['timestamp']}")
                            print("========================")
                            qr_detectado = True

            except Exception as e:
                logger.error(f"Falha no processo de leitura QR Code: {str(e)}")
                return False
            
        if pontos_medicamento['suctionCup'].lower() == 'on':
            robo.suck(True)            
            
            try:
                if sensor_infravermelho.verificar_objeto_detectado():
                    logger.warning("Falha na pega do medicamento. Reiniciando rotina...")
                    robo.movel_to(x, y, 143.0, r, wait=True)
                    return executar_rotina_medicamento(
                        robo, medicamento, medicamentos,
                        delta_z=0, tentativas=tentativas+1, max_tentativas=max_tentativas
                    )
                
            except Exception as e:
                logger.error(f"Erro na verificação do sensor: {e}")
                return False
                
        else:
            robo.suck(False)
    
    return True