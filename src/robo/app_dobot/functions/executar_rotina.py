import smbus
SLAVE_ADDRESS = 8       # Endereço do Arduino no barramento I2C
bus = smbus.SMBus(1)    # Utiliza o barramento I2C 1 (padrão no Raspberry Pi)

def executar_rotina_medicamento(robo, medicamento,  medicamentos, delta_z = 0, tentativas=0, max_tentativas=3):
    
    
    if isinstance(medicamento, str):
        medicamento = int(medicamento[-1])
        
    if tentativas >= max_tentativas:
        print(f"Máximo de {max_tentativas} tentativas atingido. Abortando a operação.")
        robo.home()
        return False

    # Configurar velocidade padrão
    robo.set_speed(200, 200)
    robo.home()
    
    for i in range(len(medicamentos[medicamento - 1]['pontos'])):
        pontos_medicamento = medicamentos[medicamento - 1]['pontos'][i]  
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
            
        if pontos_medicamento['suctionCup'].lower() == 'on':
            robo.suck(True)
            
            ## Lógica para verificar se o medicamento foi pego com sensor IR 
            
            data = bus.read_i2c_block_data(SLAVE_ADDRESS, 0, 2)
            sensor_value = (data[0] << 8) | data[1]
            print("Valor do sensor:", sensor_value)
            
            if sensor_value > 250:
                robo.movel_to(x, y, 143.0, r, wait=True)
                return executar_rotina_medicamento(robo, medicamento, medicamentos, delta_z=0, tentativas=tentativas+1, max_tentativas=max_tentativas)
            
            ## if sensor_value > 250:
            ##     recomeçar a montagem
            ##      log de montagem falha 
            ### log de valor do sensor
            
        else:
            robo.suck(False)
    return True
        
