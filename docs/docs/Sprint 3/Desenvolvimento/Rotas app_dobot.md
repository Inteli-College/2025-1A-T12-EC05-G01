---
title: Integração e Controle do Dobot
sidebar_position: 2
slug: /rotas-app-dobot
---

&nbsp;&nbsp;&nbsp;&nbsp;Para facilitar a comunicação entre o Front-End e o robô Dobot, bem como com os hardwares periféricos, foi desenvolvida uma aplicação Flask chamada `app_dobot`. Essa aplicação serve como uma ponte entre a interface do usuário e as funcionalidades do robô, substituindo a antiga abordagem baseada em CLI (Command Line Interface). A `app_dobot` contém rotas HTTP que permitem enviar comandos ao robô e receber respostas sobre o status das operações.

&nbsp;&nbsp;&nbsp;&nbsp;A aplicação começa com a inicialização dos dispositivos, incluindo a conexão com o robô Dobot. A função `inicializar_dispositivos` é responsável por detectar a porta serial onde o Dobot está conectado, estabelecer a conexão e inicializar o robô. Após a inicialização, um log é enviado para o banco de dados para registrar o sucesso da operação.

```python
def inicializar_dispositivos():
    global dobot, qr_reader
    
    # Verifica se já foi inicializado
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true' and app_dobot.debug:
        return
    
    # Conectar Dobot
    print("\n[CONEXÃO DOBOT]")
    ports = SerialPortFinder.find_available_ports()
    port = DobotAutoDetector.detect(ports)
    connection_handler = DobotConnectionHandler()
    connection_handler.connect(port)
    connection_handler.initialize_robot()
    dobot = connection_handler.robot
    print("=== DISPOSITIVOS INICIALIZADOS ===\n")

    # Enviar logs para o banco
    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description": "Dispositivos inicializados.",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

```

&nbsp;&nbsp;&nbsp;&nbsp;Desse modo, assim que a aplicação é iniciada, o robô é conectado, permitindo que possam ser criadas as rotas relacionadas ao controle do Dobot. Nesse sentido, uma das rotas implementadas é a `/dobot/home`, que move o robô para a posição inicial (home). Após a execução do comando de movimentação, um log é registrado no banco de dados para rastrear a ação. Esse log contém informações como o nível de severidade (INFO, WARNING, ERROR, etc.), a origem da ação (neste caso, "sistema"), a descrição da ação realizada e o status (SUCCESS ou FAILURE). O código abaixo ilustra essa funcionalidade:

```python
@app_dobot.route("/dobot/home", methods=["GET"])
def move_home():
    dobot.home()

    data = {
        "level":"INFO",
        "origin":"sistema",
        "action":"STARTUP",
        "description":"Moved to home position",
        "status": "SUCCESS"
    }
    requests.post(f"{DATABASE_URL}/logs/create", json=data)

    return jsonify({"message": "Moved to home position"}), 200
```

&nbsp;&nbsp;&nbsp;&nbsp;A imagem abaixo mostra a tabela de logs no banco de dados, visualizada através do DBeaver. Cada entrada na tabela representa uma ação realizada pelo sistema, incluindo a movimentação para a posição home. Essa tabela visa a permitir o rastreamento do histórico de operações e identificação de possíveis problemas.

<div align="center">
<sub>Figura 1 - Tabela Logs</sub>

![Tabela Logs](<../../../static/img/tabela_logs.png>)
<sub>Fonte: Elaborado pelo grupo Dose Certa (2025)</sub>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Além da rota `/dobot/home`, outras funcionalidades do robô foram implementadas:

- **`/dobot/move`**: Recebe coordenadas e move o robô para a posição especificada.
- **`/dobot/medicamento/<medicamento>`**: Recebe o número do medicamento e executa a rotina de separação para esse medicamento.
- **`/dobot/limpar-todos-alarmes`**: Tira o robô do estado de alarme, quando ele considera que está no limite de movimento.
- **`/dobot/posicao`**: Retorna a posição atual do robô.
- **`/dobot/fita/adicionar`**: Adiciona um medicamento à fita que será montada.
- **`/dobot/fita/montar`**: Inicia a montagem de uma fita de medicamentos.
- **`/dobot/fita/cancelar`**: Cancela a montagem de uma fita de medicamentos.


&nbsp;&nbsp;&nbsp;&nbsp;Para a próxima Sprint, o foco será na refatoração do código da `app_dobot` para melhorar sua organização e modularidade. Uma das principais mudanças será a utilização de Blueprints, um recurso do Flask que permite dividir a aplicação em módulos menores e mais gerenciáveis. Além disso, planeja-se substituir o protocolo HTTP atualmente utilizado pelo MQTT (Message Queuing Telemetry Transport), um protocolo de comunicação adequado para sistemas IoT (Internet of Things) e aplicações que exigem baixa latência e alta confiabilidade, facilitando a implementação de notificações em tempo real.

&nbsp;&nbsp;&nbsp;&nbsp;Portanto, por meio das rotas HTTP, a aplicação facilita a comunicação entre o Front-End e o robô, permitindo operações como movimentação, separação de medicamentos e montagem de fitas. Ademais, a inclusão de logs no banco de dados garante transparência e facilita a identificação de problemas, enquanto a estrutura do Flask abre espaço para futuras melhorias, como a adoção do protocolo MQTT para comunicação em tempo real e melhor organização do código.