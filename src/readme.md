# Guia de Como Rodar o Sistema

Este guia explica como configurar e executar o projeto **Dose Certa**, incluindo o backend, frontend, CLI e conexão com o robô.

---

## **Pré-requisitos**  

Antes de começar, certifique-se de ter os seguintes programas instalados:  
- [Visual Studio Code (VSCode)](https://code.visualstudio.com/)  
- [Python 3](https://www.python.org/downloads/) + [pip](https://pip.pypa.io/en/stable/installation/)  
- [Git](https://git-scm.com/downloads)  
- [Node.js](https://nodejs.org/) (recomendado: versão 18 ou superior)  

---

## **Clonar o Projeto e Preparar o Ambiente**

```bash
git clone https://github.com/Inteli-College/2025-1A-T12-EC05-G01
cd 2025-1A-T12-EC05-G01
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
cd src
pip install -r requirements.txt
```

## Conexão com o robô

Para estabelecer a conexão com o robô e garantir que seja possível executar todo o sistema de forma completa, com o script ```executar_projeto.sh```, é necessário estabelecer uma conexão SSH com o Raspberry Pi. Para isso, utilizando o VS Code, é preciso selecionar o botão a opção "Abrir uma Janela Remota" (ou "Open a Remote Window") no canto inferior esquerdo da tela. Em seguida, selecione em "Connect to Host..." e insira o comando a seguir:

```bash
ssh grupo-01@10.128.0.32    # Substitua o que vem após o "@" pelo endereço de IP
```

Quando solicitado, insira a senha: dosecerta

Após a conexão ser estabelecida, você terá acesso ao Raspberry Pi e poderá executar o sistema conforme descrito nas próximas etapas.

## Executando o Projeto com Script Automatizado (Recomendado) ✅

A forma mais simples de executar o sistema é utilizando o script `executar_projeto.sh`, que automatiza o processo de inicialização com `tmux`.

Comando básico:

```bash
./executar_projeto.sh
```

Esse comando iniciará automaticamente:

- Backend

- Frontend

- App Dobot (controle do braço robótico)

No entanto, há também outras opções, ao utilizar flags, quando executar o `executar_projeto.sh`:

```bash
./executar_projeto.sh --cli    # Inicia apenas a CLI (robo)
./executar_projeto.sh --web    # Inicia apenas o Frontend e Backend
./executar_projeto.sh --help   # Exibe ajuda com as opções disponíveis
```
Por fim, é necessário se certificar de dar as permissões necessárias para a execução do script, com:

```bash
chmod +x executar_projeto.sh
```


## Execução Manual (Opção alternativa)

### 1. Execução da CLI

Estando em "C:/Users/Seu-Usuário/Caminho-para-pasta/2025-1A-T12-EC05-G01>
 
Entre em:  

```bash
cd src/robo
```
Para executar a CLI, use o comando:  

```bash
python3 -m CLI.CLI
```

### Executar Backend

Acesse o diretório `src`:

```bash
cd src
```

Após isso, execute o seguinte comando: 

```bash
python3 -m software.backend.backend
```

### Executar Frontend

Crie um novo terminal e entre na pasta `frontend`:  

```bash
cd src/software/frontend
```

Instale as dependências com:

```bash
cd npm install
```

Execute: 

```bash
npm run dev
```

Com isso, é esperado aparecer algo como o seguinte no terminal

```bash
(venv) inteli@Notebook-0392:~/Inteli/Projetos - 2° ano/HC Unicamp/2025-1A-T12-EC05-G01/src/software/frontend$ npm run dev

> frontend@0.0.0 dev
> vite


  VITE v6.2.0  ready in 162 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Assim, acesse o link disponibilizado em http://localhost:5173


### Executar app_dobot

Por fim, é necessário a criação de um último terminal, em que após isso será necessário executar:

```bash
cd src/robo
```

Com o robô conectado, basta executar o seguinte código

```bash
python3 -m app_dobot.app_dobot
```
