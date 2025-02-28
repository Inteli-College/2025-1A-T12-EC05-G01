---
title: Interface Desenvolvida pela Equipe
sidebar_position: 4
slug: /interface-programatica
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Interface de Controle Programática

A interface desenvolvida pela equipe permite a manipulação do robô de forma programática, facilitando a integração entre o sistema de automação e o hardware. Implementada como uma aplicação de linha de comando (CLI), ela reúne diversas funcionalidades essenciais para o controle, monitoramento e manutenção do robô.

Para entender melhor como executar o program e controlar o robô por meio da CLI, há uma explicação detalhada no `src/README.md`. No entanto, apesar disso, abaixo há uma breve explicação do passo a passo que deve ser feito no terminal, com a execução de um comando de cada vez, necessários para ser possível acessar a CLI e fazer uso de suas funcionalidades.

```
python -m venv venv
venv/Scripts/Activate
cd src
pip install -r requirements.txt
cd robo
python -m CLI.CLI
```

Desse modo, os comandos acima proporcionam a criação e ativação do ambiente virtual, entrada nos diretórios corretos, instalação das bibliotecas necessárias para a execução do projeto e, por fim, a ativação da CLI.

## Funcionalidades Principais da CLI

- **Seleção de Porta Serial:**  
  Através de uma interface interativa, o usuário pode escolher a porta serial na qual o robô está conectado. Se o usuário não souber qual é a porta, a interface possibilita a **detecção automática** do robô nas portas disponíveis.

- **Execução de Rotinas de Movimento:**  
  A CLI permite executar rotinas de movimento para a coleta e transporte de medicamentos. Cada rotina é composta por uma sequência de pontos pré-definidos, e a função `executar_rotina_medicamento` comanda o robô para seguir esses pontos, diferenciando entre movimentos lineares (`movl`) e por juntas (`movj`).

- **Montagem de Fitas:**  
  A interface possibilita a montagem de fitas de medicamentos. O usuário pode **definir o medicamento desejado e as respectivas quantidades desejadas**. Assim, o sistema executa as rotinas correspondentes para cada medicamento, repetindo o processo conforme necessário.

- **Controle Manual:**  
  Para ajustes finos ou testes, a CLI oferece um modo de controle manual. Utilizando comandos direcionais via teclado, **o usuário pode mover o robô incrementalmente**, facilitando a calibração e correção da posição.

- **Feedback Interativo e Monitoramento:**  
  Com o uso de spinners (por meio da biblioteca `yaspin`) e prompts interativos (usando `inquirer`), a interface fornece **feedback visual em tempo real**, informando o usuário sobre o andamento das operações e eventuais erros ou alarmes.

- **Módulo de Ajuda Integrado:**  
  Um sistema de ajuda interativo orienta o usuário sobre as funcionalidades disponíveis e como utilizá-las, garantindo uma experiência de uso mais intuitiva.

## Componentes da Implementação

A estrutura da CLI é modular, dividida em diversas classes e funções que trabalham em conjunto para proporcionar um controle eficiente do robô:

- **CLI.py:**  
  É o ponto de entrada do sistema, responsável por gerenciar a conexão com o robô, a seleção de portas seriais e o fluxo de execução das rotinas de movimento.

- **UserInterfaceHandler.py:**  
  Encapsula os métodos para exibição de spinners, seleção de opções e tratamento de erros, facilitando a interação com o usuário.

- **utils.py:**  
  Contém funções fundamentais como `executar_rotina_medicamento`, `montar_fita` e `controle_manual`, que implementam as ações de movimento e controle do robô.

- **DobotConnectionHandler.py e DobotAutoDetector.py:**  
  Gerenciam a conexão com o robô, incluindo a detecção automática da porta e a inicialização dos parâmetros do dispositivo. Elas fazem uso de funções presentes em outros arquivos, como `PortTester.py` e `SerialPortFinder`. 

- **help_cli.py:**
  Contém o dicionário com as explicações das operações possíveis de serem realizadas na CLI e uma função para exibir essas informações.  

## Exemplo de Fluxo de Operação

Ao iniciar a CLI, o usuário é guiado pelas seguintes etapas:

1. **Detecção e Seleção da Porta:**  
   O sistema lista todas as portas seriais disponíveis e solicita ao usuário que selecione a porta correspondente ao robô. Se necessário, a detecção automática é acionada.

2. **Inicialização do Robô:**  
   Após a seleção, o robô é conectado e inicializado, sendo posicionado na "home" para garantir um ponto de partida seguro e padronizado.

3. **Apresentação do Menu de Ações:**  
   Um menu interativo apresenta as opções disponíveis, tais como:
   - Executar rotina de medicamento
   - Montar fita de medicamentos
   - Controle manual
   - Exibir posição atual
   - Ir para home
   - Sair
   - Ajuda

4. **Execução da Ação Selecionada:**  
   Dependendo da escolha, a função correspondente é chamada para executar a operação desejada, enviando os comandos apropriados para o robô.

```python
# Exemplo simplificado da seleção de ação na CLI:
acao = inquirer.prompt([
    inquirer.List(
        'acao',
        message="Controle do Dobot",
        choices=[
            ('Executar rotina de medicamento', 'rotina'),
            ('Montar fita de medicamentos', 'fita'),
            ('Controle manual', 'manual'),
            ('Exibir posição atual', 'posicao'),
            ('Ir para home', 'home'),
            ('Sair', 'sair'),
            ('Ajuda', 'ajuda'),
        ],
        carousel=True
    )
])['acao']
```

Portanto, a construção de uma CLI intuitiva e com muitas opções não apenas simplifica a operação do robô, como também integra diversas funcionalidades essenciais para o gerenciamento completo do sistema de automação. Ela serve como a ponte entre o usuário e os mecanismos de controle do robô, possibilitando a execução de rotinas, ajustes manuais e monitoramento contínuo das operações.

:::tip Próxima Seção 
Na próxima seção, serão apresentadas as demais funcionalidades e integrações do sistema, com uma explicação detalhada do funcionamento da CLI e das principais funções que compõem o fluxo completo de controle do robô. Será possível entender como os módulos interagem para proporcionar uma operação robusta e integrada. 
:::
