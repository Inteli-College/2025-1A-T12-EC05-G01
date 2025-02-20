from Dobot.Dobot import Dobot
from pontos.carregar_medicamentos import carregar_medicamentos
from CLI.utils import handle_acao 

from serial.tools import list_ports
import inquirer
from yaspin import yaspin
from multiprocessing import Process, Queue

def buscar_portas_seriais():
    with yaspin(text="Buscando portas seriais...", color="green") as spinner:
        ports = [p.device for p in list_ports.comports()]
        if not ports:
            spinner.fail("❌ Nenhuma porta serial encontrada!")
            return 
        spinner.ok("✔ Portas encontradas!")
        return ports


def testar_conexao_porta(porta, queue):
    try:
        robo = Dobot(port=porta, verbose=False)
        pose = robo.pose() # Apenas para testar comunicação com o robô
        robo.close()
        queue.put(porta)
    except Exception as e:
        queue.put(e)

def detectar_porta_dobot(portas):
    for porta in portas:
        with yaspin(text=f"Testando porta {porta}...", color="green") as spinner:
            queue = Queue()
            p = Process(target=testar_conexao_porta, args=(porta, queue))
            
            try:
                p.start()
                p.join(timeout=5)
                
                if p.is_alive():
                    p.terminate()
                    p.join()
                    raise TimeoutError("Timeout excedido")
                
                result = queue.get_nowait()
                
                if isinstance(result, Exception):
                    raise result
                
                spinner.ok(f"✔ Dobot encontrado na porta {porta}!")
                # Retorna a porta encontrada
                return porta
                
            except TimeoutError:
                spinner.fail(f"❌ Porta {porta}: Timeout de conexão")
            except Exception as e:
                spinner.fail(f"❌ Porta {porta}: {str(e)[:50]}...")
                
    return None

def main():
    medicamentos = carregar_medicamentos()
    if not medicamentos:
        return

    portas_seriais = buscar_portas_seriais()
    if not portas_seriais:
        return

    # Adiciona a opção para detectar automaticamente a porta correta
    opcoes = portas_seriais + ["Não sei a porta do Dobot"]

    resposta = inquirer.prompt([
        inquirer.List(
            'porta',
            message="Selecione a porta do Dobot",
            choices=opcoes,
            carousel=True
        )
    ])['porta']

    if resposta == "Não sei a porta do Dobot":
        porta = detectar_porta_dobot(portas_seriais)
        if not porta:
            print("\nNenhum Dobot foi encontrado. Verifique a conexão e tente novamente.")
            return
            
        with yaspin(text="Conectando ao Dobot detectado...", color="green") as spinner:
            try:
                robo = Dobot(port=porta, verbose=False)
                robo.set_speed(200, 200)
                spinner.ok("✔ Conexão estabelecida com sucesso!")
            except Exception as e:
                spinner.fail(f"❌ Falha na conexão final: {str(e)}")
                return
    else:
        porta = resposta
        with yaspin(text="Conectando ao Dobot...", color="green") as spinner:
            try:
                robo = Dobot(port=porta, verbose=False)
                robo.set_speed(200, 200)
                spinner.ok("✔ Conectado com sucesso!")
            except Exception as e:
                spinner.fail(f"❌ Falha na conexão: {str(e)}")
                return

    robo.home()
    robo.clear_all_alarms()
    handle_acao(robo, medicamentos)

if __name__ == "__main__":
    main()
