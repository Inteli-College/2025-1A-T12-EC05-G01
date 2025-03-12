---
title: Explicação detalhada das principais funções
sidebar_position: 5
slug: /explicacao-funcoes
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Nesta seção, haverá uma descrição mais aprofundada das principais funções presentes na CLI que fazer o usuário controlar o robô adequadamente, com a presença de blocos de código e suas correspondentes explicações.

## utils.py

O arquivo `utils.py` contém funções essenciais para o fluxo de execução das rotinas do robô, com as funções de `executar_rotina_medicamento`, `montar_fita`, `controle_manual` e `handle_acao`.

### 1. `executar_rotina_medicamento`

Esta função é responsável por executar a rotina completa de movimentação para um determinado medicamento. Ela percorre uma lista de pontos definidos (carregados a partir de um arquivo JSON) e envia comandos ao robô para cada ponto, escolhendo entre movimentos lineares e por juntas, além de controlar o estado da ventosa.

O código desta função já foi apresentado anteriormente na seção "Navegação do robô".

### 2. ``montar_fita`

Responsável por permitir que o usuário selecione medicamentos diversos em quantidades variadas, o que possibilita a montagem da fita. Uma vez finalizada as escolhas, a rotina é executada e o robô realiza a montagem.

```python
def montar_fita(robo, medicamentos):
    """
    Permite ao usuário montar a fita de medicamentos escolhendo os tipos e as quantidades desejadas.
    Para cada item selecionado, a função executa a rotina do medicamento a quantidade de vezes especificada.
    """
    # Lista para armazenar os medicamentos e suas quantidades
    fita = []
    
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

        fita.append({
            "medicamento": med,
            "quantidade": qtd
        })

    # Se houver itens na fita, inicia o processo de montagem
    if fita and opcao != "cancelar":
        print("Montagem da fita iniciada...")
        for item in fita:
            med = item["medicamento"]
            quantidade = item["quantidade"]
            for i in range(quantidade):
                print(f"Iniciando rotina para Medicamento {med['medicamento']} - Unidade {i+1} de {quantidade}")
                executar_rotina_medicamento(robo, med)
        print("Montagem da fita concluída!")
    else:
        print("Nenhum medicamento selecionado para montagem da fita.")
```

Essa função faz uso da função anterior, `executar_rotina_medicamento`, para realizar a transação dos medicamentos. O diferencial dessa função é o uso do `inquirer`, para possibilitar o usuário adicionar diferentes medicamentos, as suas respectivas quantidades e realizar a montagem da fita ou cancelar a operação.

### 3. `controle_manual`

Fornece um modo de controle manual do robô. A função verifica continuamente quais teclas estão pressionadas e atualiza a posição do robô de acordo com as teclas pressionadas no teclado. As instruções para a movimentação do robô estão presentes tanto no terminal, ao selecionar essa opção, quanto ao selecionar a opção "ajuda".

```python
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
```

Com o uso da biblioteca ```keyboard```, o usuário agora pode controlar o robô para posicionar em novos pontos de interesse e combinar essa função com outro recurso da CLI, o de "Exibir a posição atual", para conseguir as coordenadas dos pontos específicos desejados.

:::warning AVISO!
Para usuários de linux, o controle manual pode não funcionar corretamente pelo fato do sistema não permitir que as operações da biblioteca `keyboard`sejam executadas. É necessário executar o comando `python3 -m CLI.CLI` de um modo diferente para resolver o problema, de modo que utilizar `sudo` antes do comando possa vir a ser a solução. No entanto, é válido ressaltar que, para essa opção alternativa funcionar, é necessário instalar os módulos no ambiente global, e não virtual. 
:::


### 4. `handle_acao`

Por último, a função `handle_acao`gerencia o menu interativo que apresenta as opções ao usuário (como executar uma rotina, montar fita, controle manual, etc.) e direciona para a função correspondente com base na escolha do usuário.

```python
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

```

Ela usa recursos da biblioteca `inquirer` para que apareça opções interativas para o usuário escolher. Com base na resposta do usuário, é atribuída uma palavra chave para cada opção, que posteriormente é utilizada para criar lógicas para chamar outras funções, que irão executar o que o usuário deseja.

## CLI.py

O arquivo CLI.py serve como ponto de entrada da aplicação. Ele é responsável por direcionar o fluxo de inicialização, conexão e execução das ações do robô.

```python
def main():
    # Carrega os medicamentos a partir de um arquivo.
    medicamentos = carregar_medicamentos()
    if not medicamentos:
        return

    # Busca todas as portas seriais disponíveis no PC.
    ports = SerialPortFinder.find_available_ports()
    if not ports:
        return

    # Interface interativa para seleção da porta.
    selected_port = UserInterfaceHandler.select_port(ports)
    
    # Caso o usuário não saiba a porta, utiliza a detecção automática.
    if selected_port == "Não sei a porta do Dobot":
        porta = DobotAutoDetector.detect(ports)
        if not porta:
            UserInterfaceHandler.show_error("Nenhum Dobot detectado. Verifique a conexão.")
            return
    else:
        porta = selected_port

    # Conexão com o robô.
    with UserInterfaceHandler.show_spinner("Conectando ao Dobot...") as spinner:
        if not connection_handler.connect(porta):
            spinner.fail("❌ Falha na conexão")
            return
        spinner.ok("✔ Conectado com sucesso!")

    # Inicializa o robô (posição home, limpeza de alarmes, etc.)
    connection_handler.initialize_robot()
    
    # Inicia o loop de ações, permitindo que o usuário escolha as operações desejadas.
    handle_acao(connection_handler.robot, medicamentos)

if __name__ == "__main__":
    main()

```

1. A função `carregar_medicamentos`lê os dados das coordenadas dos pontos a partir de seu medicamento correspondente.

2. A função `SerialPortFinder.find_available_ports()` lista as portas disponíveis e a função `UserInterfaceHandler.select_port()` permite que o usuário selecione a porta adequada.

3. Após isso, a função `DobotConnectionHandler` realiza a conexão e inicializa o robô, posicionando ele na home e limpando os alarmes.

4. A função `handle_acao` gerencia o menu de opções da CLI, permitindo ao usuário controlar o robô.

## Dobot.py

Já o arquivo `Dobot.py`, contém a definição da classe Dobot, que estende a implementação da biblioteca pydobot. A classe adiciona funcionalidades extras não implementadas pela biblioteca original, como o comando para retornar à posição "home" e métodos para movimentos específicos.

```python
import pydobot

class Dobot(pydobot.Dobot):
    """
    Classe que extende a classe inerente à biblioteca pydobot.
    Adiciona funções complementares, como 'home()', 'movej_to' e 'movel_to'.
    """
    def __init__(self, port=None, verbose=False):
        super().__init__(port=port, verbose=verbose)

    def movej_to(self, x, y, z, r, wait=True):
        super()._set_ptp_cmd(x, y, z, r, mode=pydobot.enums.PTPMode.MOVJ_XYZ, wait=wait)

    def movel_to(self, x, y, z, r, wait=True):
        super()._set_ptp_cmd(x, y, z, r, mode=pydobot.enums.PTPMode.MOVL_XYZ, wait=wait)    
        
    def home(self):
        msg = pydobot.message.Message()
        msg.id = pydobot.enums.CommunicationProtocolIDs.CommunicationProtocolIDs.SET_HOME_CMD
        msg.ctrl = pydobot.enums.ControlValues.ControlValues.ONE
        return super()._send_command(msg)
    
    def set_speed(self, speed, acceleration):
        super().speed(speed, acceleration)

```

- Construtor (__init__): Inicializa a classe estendendo a implementação original da biblioteca pydobot, possibilitando a personalização e adição de novos métodos.
- Método `movej_to`: Envia um comando para realizar um movimento por junta (movimento articular), utilizando o modo MOVJ_XYZ. Esse método é ideal para movimentos rápidos que não exigem uma trajetória linear precisa.
- Método `movel_to`: Semelhante ao anterior, mas utiliza o modo MOVL_XYZ para garantir que o robô se mova em linha reta, importante para trajetórias que requerem precisão.
- Método `home`: Envia um comando específico (através de uma mensagem formatada) para posicionar o robô na "home", que é o ponto de referência inicial e final das operações.
- Método `set_speed`: Configura a velocidade e a aceleração do robô, permitindo a otimização dos tempos de resposta e a suavidade dos movimentos.


:::tip Seção concluída!
A integração das funções presentes nos arquivos `utils.py` `CLI.py` e `Dobot.py` formam a estrutura principal do sistema de automação. O `Dobot.py` define os métodos de movimentação e comunicação com o hardware, enquanto que o `utils.py` possibilita a lógica de execução das rotinas e interação com o usuário. Já a `CLI.py`gerencia todo o fluxo de inicialização e operação do sistema. O código modularizado e com o uso de Programação Orientada à Objetos (POO) contribui para um sistema robusto e flexível
:::