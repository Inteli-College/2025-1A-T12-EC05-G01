def executar_rotina_medicamento(robo, medicamento,  medicamentos, delta_z = 0):
    
    if isinstance(medicamento, str):
        medicamento = int(medicamento[-1])

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
        else:
            robo.suck(False)
        
