from yaspin import yaspin
from CLI.clear_states import clear_states

def executar_rotina_medicamento(robo, medicamento,  medicamentos, delta_z = 0):
    """Executa a rotina completa para um medicamento selecionado, 
       iterando por cada ponto do medicamento passado e levando o robô
       para tal ponto. Também realiza verificação se o movimento é 
       linear ou por junta, e se o suctionCup está ativo ou não.
       Manda o robô para home antes e depois de pegar o medicamento."""
    
    if isinstance(medicamento, str):
        medicamento = int(medicamento[-1])
    
    
    with yaspin(text=f"Executando rotina para Medicamento {medicamento}...", color="green") as spinner:
        try:
            # Configurar velocidade padrão
            robo.set_speed(200, 200)
            robo.home()
            
            for i in range(len(medicamentos[medicamento - 1]['pontos'])):
                pontos_medicamento = medicamentos[medicamento - 1]['pontos'][i] 
                ##print(pontos_medicamento)   
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
           
                spinner.text = f"Medicamento {medicamento} - Ponto {i + 1}/{len(medicamentos[medicamento - 1]['pontos'])} concluído"
            
            spinner.ok("✔ Rotina completa executada com sucesso!")
            clear_states(robo)
        except Exception as e:
            spinner.fail(f"❌ Falha na execução: {str(e)}")
            clear_states(robo)
            
        clear_states(robo)