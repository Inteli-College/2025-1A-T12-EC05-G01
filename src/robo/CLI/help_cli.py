help_comandos = {
    "rotina": 
    {
        "titulo": "Executar Rotina de Medicamento",
        "descricao": "Permite executar a rotina predefinida para um medicamento cadastrado. O robô seguirá uma sequência de pontos para manipular o medicamento de forma automatizada.",
        "detalhes": """Durante a execução, o robô:
            - Move-se entre os pontos programados.
            - Ativa ou desativa a ventosa conforme necessário.
            - Retorna à posição inicial ao finalizar."""
    },
    "manual": 
    {
        "titulo": "Controle Manual do Dobot",
        "descricao": "Permite controlar o robô manualmente utilizando o teclado para movimentação.",
        "detalhes": """Teclas disponíveis:
            - ←/→: mover em X
            - ↑/↓: mover em Y
            - W/S: mover em Z
            - A/D: ajustar rotação
            - Q: sair do modo manual
            - H: retornar à posição inicial (home)"""
    },
    "posicao": 
    {
        "titulo": "Exibição da Posição Atual",
        "descricao": "Exibe as coordenadas atuais do robô em relação ao seu espaço de trabalho.",
        "detalhes": """O comando retorna:
            - X: Posição no eixo X (mm)
            - Y: Posição no eixo Y (mm)
            - Z: Altura no eixo Z (mm)
            - R: Rotação do robô (graus)"""
    },
    "home": 
    {
        "titulo": "Retornar à Posição Home",
        "descricao": "Move o robô para a posição inicial segura, recomendada antes de qualquer operação.",
        "detalhes": """Este comando pode ser útil para:
            - Garantir um ponto de referência antes de iniciar novas tarefas.
            - Resolver desalinhamentos causados por paradas inesperadas."""
    },
    "sair": 
    {
        "titulo": "Encerrar Conexão e Finalizar CLI",
        "descricao": "Finaliza a conexão com o robô e encerra a execução da CLI de maneira segura.",
        "detalhes": """Ao executar este comando:
            - O robô retorna à posição home antes de desligar.
            - Todos os alarmes são limpos para garantir uma inicialização correta na próxima execução."""
    },
    "fita":
    {
      
      "titulo": "Montar fita com medicamentos",
      "descricao": "Permite selecionar vários medicamentos em quantidades variadas para se montar uma fita de medicamentos",
      "detalhes": """Ao executar este comando:
        - Você poderá escolher um medicamento e a quantidade para tal medicamento.
        - Medicamentos podem ser adicionados sem ordem específica.
        - Ao finalizar a escolha de medicamentos e quantidades, aperte para finalizar montagem e o robô começará a separação.
        - Caso queira cancelar, apenas selecione 'Cancelar montagem da fita'."""
    },
    "alarmes":
    {
        "titulo": "Limpar os estados de alarme do robô",
        "descricao": "Permite resetar/limpar os estados de alarme do robô",
        "detalhes": """ O Dobot (robô) possui um sistema de alarme para alertar ao usuário que chegou em uma posição limite.
        Entretanto, muitas vezes ele entende que está no seu limite quando na verdade não está. Esse alarme
        pode ser visualizado através do led na sua base, que, quando em alarme, fica vermelho. Este comando
        apenas limpa este alarme, avisando ao robô que ele não está em posição limite e volta o led para verde."""
    }
}

def exibir_help(acao=None):
    if acao and acao in help_comandos:
        comando = help_comandos[acao]
        print(f"\n{comando['titulo']}")
        print("=" * len(comando['titulo']))
        print(f"\n{comando['descricao']}\n")
        print(comando['detalhes'])
        print()
    else:
        print("\nDobot CLI - Controle do Braço Robótico")
        print("=" * 40)
        print("\nComandos disponíveis:")
        for chave, comando in help_comandos.items():
            print(f"  {chave}: {comando['descricao']}")
        print("\nPara obter mais detalhes, use: exibir_help('comando')")
        print("Exemplo: exibir_help('manual')\n")
