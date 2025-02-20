from Dobot.Dobot import Dobot
from pontos.carregar_medicamentos import carregar_medicamentos
from CLI.utils import executar_rotina_medicamento, controle_manual 

from serial.tools import list_ports
import inquirer
from yaspin import yaspin

def buscar_portas_seriais():
    with yaspin(text="Buscando portas seriais...", color="green") as spinner:
        ports = [p.device for p in list_ports.comports()]
        if not ports:
            spinner.fail("❌ Nenhuma porta serial encontrada!")
            return 
        return ports

def main():
    medicamentos = carregar_medicamentos()
    if not medicamentos:
        return

    portas_seriais = buscar_portas_seriais()
    print(portas_seriais)
    porta = inquirer.prompt([
        inquirer.List(
            'porta',
            message="Selecione a porta do Dobot",
            choices=portas_seriais,
            carousel=True
        )
    ])['porta']

    with yaspin(text="Conectando ao Dobot...", color="green") as spinner:
        try:
            robo = Dobot(port=porta, verbose=False)
            robo.set_speed(100, 100)  # Velocidade padrão
            spinner.ok("✔ Conectado com sucesso!")
        except Exception as e:
            spinner.fail(f"❌ Falha na conexão: {str(e)}")
            return
    
    robo.home()
    print(robo.get_alarm_state())
    robo.clear_all_alarms()

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
                    ('Sair', 'sair')
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
            robo.close()
            print("Conexão encerrada.")
            break

if __name__ == "__main__":
    main()
