from yaspin import yaspin 
import keyboard 
import inquirer 
from CLI.help_cli import exibir_help
from CLI.executar_rotina import executar_rotina_medicamento 
from CLI.clear_states import clear_states
from CLI.montar_fita import montar_fita
from CLI.controle_manual import controle_manual            

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

        escolhas = [(f"Medicamento {m}") for m in range(1, 6)]
        escolhas.append('Cancelar rotina')

        if acao == 'rotina':
            med = inquirer.prompt([
                inquirer.List(
                    'medicamento',
                    message="Selecione o medicamento",
                    choices=escolhas,
                    carousel=True
                )
            ])['medicamento']
            if med == 'Cancelar rotina':
                return
            executar_rotina_medicamento(robo, med, medicamentos)

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
            robo.home()
            robo.clear_all_alarms()
            robo.close()
            quit() ## sai do programa

        elif acao == 'ajuda':
            resposta = inquirer.prompt([
                inquirer.List(
                    'help',
                    message="Selecione uma opção de ajuda",
                    choices=[
                        ('Ajuda geral', 'geral'),
                        ('Executar rotina de medicamento', 'rotina'),
                        ('Montar fita de medicamentos', 'fita'),
                        ('Controle manual', 'manual'),
                        ('Exibir posição atual', 'posicao'),
                        ('Ir para home', 'home'),
                        ('Limpar alarmes', 'alarmes'),
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



