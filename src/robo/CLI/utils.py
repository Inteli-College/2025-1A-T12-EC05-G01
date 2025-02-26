from yaspin import yaspin 
import keyboard 
import inquirer 
from CLI.help_cli import exibir_help

constante_z = 12.0

def executar_rotina_medicamento(robo, medicamento,  medicamentos, delta_z = 0):
    """Executa a rotina completa para um medicamento selecionado, 
       iterando por cada ponto do medicamento passado e levando o robô
       para tal ponto. Também realiza verificação se o movimento é 
       linear ou por junta, e se o suctionCup está ativo ou não.
       Manda o robô para home antes e depois de pegar o medicamento."""
       
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
                
                print(pontos_medicamento['movimento'])
                
                if pontos_medicamento['movimento'] == 'movj':
                    robo.movej_to(x, y, z, r, wait=True)
                elif pontos_medicamento['movimento'] == 'movl':
                    robo.movel_to(x, y, z, r, wait=True)
                    
                if pontos_medicamento['suctionCup'].lower() == 'on':
                    robo.suck(True)
                else:
                    robo.suck(False)
           
                spinner.text = f"Medicamento {medicamento} - Ponto {i}/{len(medicamentos[medicamento - 1]['pontos'])} concluído"
            
            spinner.ok("✔ Rotina completa executada com sucesso!")
            clear_states(robo)
        except Exception as e:
            spinner.fail(f"❌ Falha na execução: {str(e)}")
            clear_states(robo)
            
        clear_states(robo)
            
def montar_fita(robo, medicamentos):
    """
    Permite ao usuário montar a fita de medicamentos escolhendo os tipos e as quantidades desejadas.
    Para cada item selecionado, a função executa a rotina do medicamento a quantidade de vezes especificada.
    """
    # Lista para armazenar os medicamentos e suas quantidades
    fita = {}
    
    while True:
        opcao = inquirer.prompt([
            inquirer.List(
                'opcao',
                message="Montar fita: Selecione a ação",
                choices=[
                    ("Adicionar medicamento", "adicionar"),
                    ("Realizar montagem da fita", "finalizar"),
                    ("Cancelar montagem da fita", "cancelar")
                ],
                carousel=True
            )
        ])['opcao']

        if opcao == "finalizar":
            break
        elif opcao == "cancelar":
            break

        # Seleciona o medicamento (utilizando os medicamentos carregados previamente)
        med = inquirer.prompt([
            inquirer.List(
                'medicamento',
                message="Selecione o medicamento",
                choices=[(f"Medicamento {m['medicamento']}", m) for m in medicamentos],
                carousel=True
            )
        ])['medicamento']

        # Permite que o usuário informe a quantidade desejada
        qtd_str = inquirer.prompt([
            inquirer.Text(
                'qtd',
                message="Digite a quantidade de medicamentos"
            )
        ])['qtd']

        try:
            qtd = int(qtd_str)
        except ValueError:
            print("Quantidade inválida. Tente novamente.")
            continue

        if med['medicamento'] not in fita:
            fita[med['medicamento']] = qtd
        else:
            fita[med['medicamento']] += qtd
        
        ##fita.append({
        ##    "medicamento": med['medicamento'],
        ##    "quantidade": qtd
        ##})
        
        print(f"FITA: {fita}")
        ##for item in fita:
        ##    print(item['medicamento']['medicamento'])
        ##print(qtd)
        ##print(f"MED: {med}")
        
        ## [{med1: qtd}, {med: qtd}, {med1: qtd}, {med: qtd}]
        ## constante 
        ## constante . indice = acresc no z 

        for key, value in fita.items():
            print(f"Medicamento: {key}, quantidade: {value}")


    # Se houver itens na fita, inicia o processo de montagem
    if fita and opcao != "cancelar":
        print("Montagem da fita iniciada...")
        for medicamento, quantidade in fita.items():
            for i in range(quantidade):
                delta_z = i *  constante_z
                print(f"Iniciando rotina para Medicamento {medicamento} - Unidade {i+1} de {quantidade}")
                executar_rotina_medicamento(robo, medicamento, medicamentos, delta_z)
        print("Montagem da fita concluída!")
    else:
        print("Nenhum medicamento selecionado para montagem da fita.")

def controle_manual(robo, delta=20):
    """Controle manual com movimentos do tipo MOVJ"""
    print("Modo de controle manual ativado (MOVJ). Use as teclas:")
    print("  ←/→: mover em X | ↑/↓: mover em Y | W/S: mover em Z")
    print("  A/D: ajustar rotação | Q: sair")
    
    while True:
        if keyboard.is_pressed('q'):
            print("Saindo do modo de controle manual.")
            break

        if keyboard.is_pressed('h'):
            robo.home();
        

        x, y, z, r, *_ = robo.pose()
        dx = dy = dz = dr = 0
        
        # A fim de melhorar um pouco a fluidez, o que é feito
        # é basicamente aumentar a variação de movimento
        # a cada momento em que a tecla está pressionada.
        # No final, passamos a posição atualizada ao robô
        if keyboard.is_pressed('left'): dx = -delta
        if keyboard.is_pressed('right'): dx = delta
        if keyboard.is_pressed('up'): dy = delta
        if keyboard.is_pressed('down'): dy = -delta
        if keyboard.is_pressed('w'): dz = delta
        if keyboard.is_pressed('s'): dz = -delta
        if keyboard.is_pressed('a'): dr = -delta
        if keyboard.is_pressed('d'): dr = delta

        if dx or dy or dz or dr:
            robo.movej_to(
                x + dx,
                y + dy,
                z + dz,
                r + dr,
                wait=False
            )

def handle_acao(robo, medicamentos):
    """
    Recebe uma instância do robô e a lista de medicamentos.
    Oferece uma lista de ações para o usuário e aguarda a escolha.
    Após escolha, faz o handle de direcionar qual função deve ser chamada.
    """
    while True:
        acao = inquirer.prompt([
            inquirer.List(
                'acao',
                message="Controle do Dobot",
                choices=[
                    ('Executar rotina de medicamento', 'rotina'),
                    ('Montar fita de medicamentos', 'fita'),
                    ('Controle manual', 'manual'),
                    ('Posição atual', 'posicao'),
                    ('Ir para home', 'home'),
                    ('Limpar alarmes', 'alarme'),
                    ('Sair', 'sair'),
                    ('Ajuda', 'ajuda'),
                ],
                carousel=True
            )
        ])['acao']

        if acao == 'rotina':
            med = inquirer.prompt([
                inquirer.List(
                    'medicamento',
                    message="Selecione o medicamento",
                    choices=[(f"Medicamento {m['medicamento']}", m) for m in medicamentos],
                    carousel=True
                )
            ])['medicamento']
            executar_rotina_medicamento(robo, med)

        elif acao == 'fita':
            montar_fita(robo, medicamentos)

        elif acao == 'manual':
            controle_manual(robo)

        elif acao == 'posicao':
            x, y, z, r, *_ = robo.pose()
            print(f"\nPosição atual:\nX: {x:.1f} mm\nY: {y:.1f} mm\nZ: {z:.1f} mm\nR: {r:.1f}°\n")

        elif acao == 'home':
            with yaspin(text="Retornando à posição home...", color="green") as spinner:
                robo.home()
                spinner.ok("✔ Home alcançado!")

        elif acao == 'sair':
            print("Conexão encerrada.")
            # print(robo.get_alarm_state())
            robo.home()
            robo.clear_all_alarms()
            robo.close()
            break

        elif acao == 'ajuda':
            resposta = inquirer.prompt([
                inquirer.List(
                    'help',
                    message="Selecione uma opção de ajuda",
                    choices=[
                        ('Ajuda geral', 'geral'),
                        ('Executar rotina de medicamento', 'rotina'),
                        ('Controle manual', 'manual'),
                        ('Exibir posição atual', 'posicao'),
                        ('Ir para home', 'home'),
                        ('Encerrar conexão', 'sair')
                    ],
                    carousel=True
                )
            ])['help']
        
            if resposta == 'geral':
                exibir_help()
            else:
                exibir_help(resposta)
        
        elif acao == 'alarme':
            clear_states(robo)



def clear_states(robo):
    robo.get_alarm_state()
    robo.clear_all_alarms()
    robo.home()