from yaspin import yaspin 
import keyboard 
import time
import inquirer 
from CLI.help_cli import exibir_help

def executar_rotina_medicamento(robo, medicamento):
    """Executa a rotina completa para um medicamento selecionado"""
    with yaspin(text=f"Executando rotina para Medicamento {medicamento['medicamento']}...", color="green") as spinner:
        try:
            # Configurar velocidade padrão
            robo.set_speed(200, 200)
            robo.home()
            

            for i, ponto in enumerate(medicamento['pontos'], 1):
                # Converter coordenadas para float
                x = float(ponto['x'])
                y = float(ponto['y'])
                z = float(ponto['z'])
                r = float(ponto['r'])
                
                # Selecionar tipo de movimento
                if ponto['movimento'] == 'movj':
                    robo.movej_to(x, y, z, r, wait=True)
                elif ponto['movimento'] == 'movl':
                    robo.movel_to(x, y, z, r, wait=True)
                
                # Controlar ventosa
                if ponto['suctionCup'].lower() == 'on':
                    robo.suck(True)
                else:
                    robo.suck(False)
                
                
                spinner.text = f"Medicamento {medicamento['medicamento']} - Ponto {i}/{len(medicamento['pontos'])} concluído"
            
            spinner.ok("✔ Rotina completa executada com sucesso!")
        except Exception as e:
            spinner.fail(f"❌ Falha na execução: {str(e)}")

        robo.home()

def controle_manual(robo, delta=20, interval=0.005):
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
    while True:
        acao = inquirer.prompt([
            inquirer.List(
                'acao',
                message="Controle do Dobot",
                choices=[
                    ('Executar rotina de medicamento', 'rotina'),
                    ('Controle manual', 'manual'),
                    ('Posição atual', 'posicao'),
                    ('Ir para home', 'home'),
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



   

