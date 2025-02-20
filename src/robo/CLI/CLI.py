from Dobot.Dobot import Dobot

import json
from serial.tools import list_ports
import inquirer
from yaspin import yaspin
import time
import keyboard

def carregar_medicamentos(arquivo='pontos/pontos.json'): ## Caminho relativo à pasta robo
    """Carrega os medicamentos e seus pontos do arquivo JSON"""
    try:
        with open(arquivo, 'r') as f:
            dados = json.load(f)
            return dados['medicamentos']
    except FileNotFoundError:
        print(f"Erro: Arquivo {arquivo} não encontrado!")
        return None
    except json.JSONDecodeError:
        print(f"Erro: Formato inválido no arquivo {arquivo}!")
        return None
    except KeyError:
        print("Erro: Estrutura do JSON inválida!")
        return None

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
                
                # Pequena pausa para estabilização
                time.sleep(0.3)
                
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
            time.sleep(interval)

def main():
    medicamentos = carregar_medicamentos()
    if not medicamentos:
        return

    with yaspin(text="Buscando portas seriais...", color="green") as spinner:
        ports = [p.device for p in list_ports.comports()]
        if not ports:
            spinner.fail("❌ Nenhuma porta serial encontrada!")
            return

    porta = inquirer.prompt([
        inquirer.List(
            'porta',
            message="Selecione a porta do Dobot",
            choices=ports,
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
