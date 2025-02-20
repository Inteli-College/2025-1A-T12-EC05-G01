from Dobot.Dobot import Dobot
from pontos.carregar_medicamentos import carregar_medicamentos
from CLI.utils import handle_acao 

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
            robo.set_speed(200, 200)  # Velocidade padrão
            spinner.ok("✔ Conectado com sucesso!")
        except Exception as e:
            spinner.fail(f"❌ Falha na conexão: {str(e)}")
            return
    
    robo.home()
    # print(robo.get_alarm_state())
    robo.clear_all_alarms()

    handle_acao(robo, medicamentos)

if __name__ == "__main__":
    main()
