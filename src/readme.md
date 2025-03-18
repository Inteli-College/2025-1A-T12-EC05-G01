# Guia de Como Rodar o Sistema

Este breve guia explica como configurar e executar o projeto: Dose Certa localmente, possibilitando o acesso ao frontend desenvolvido até o momento e o controle por meio da CLI.  

## **Pré-requisitos**  
Antes de começar, certifique-se de ter os seguintes programas instalados:  
- [Visual Studio Code (VSCode)](https://code.visualstudio.com/)  
- [Python 3](https://www.python.org/downloads/) e [pip](https://pip.pypa.io/en/stable/installation/)  
- [Git](https://git-scm.com/downloads)  

## **Passo a Passo Inicial**

### 1. Clonar o repositório  
Abra o terminal e execute o comando:  

```bash
git clone https://github.com/Inteli-College/2025-1A-T12-EC05-G01
```

### 2. Criar um ambiente virtual  
Entre na raiz do projeto e crie um ambiente virtual:  

```bash
python3 -m venv venv
```

### 3. Ativar o ambiente virtual  
Dependendo do sistema operacional, use um dos comandos abaixo:  

**Windows (Prompt de Comando ou PowerShell):**  
```bash
venv\Scripts\activate
```

**Mac/Linux:**  
```bash
source venv/bin/activate
```

### 4. Acessar o diretório src

Estando em "C:/Users/Seu-Usuário/Caminho-para-pasta/2025-1A-T12-EC05-G01>
 
Entre na pasta principal do projeto:  

```bash
cd src 
```

### 5. Instalar as dependências

Baixe e instale todas as bibliotecas necessárias:  

```bash
pip install -r requirements.txt
```

### 6. Conexão com o robô

Para estabelecer a conexão com o robô e garantir que seja possível executar o ```app_dobot```, é necessário estabelecer uma conexão SSH com o Raspberry Pi. Para isso, utilizando o VS Code, é preciso selecionar o botão a opção "Abrir uma Janela Remota" (ou "Open a Remote Window") no canto inferior esquerdo da tela. Em seguida, selecione em "Connect to Host..." e insira o comando a seguir:

```bash
ssh grupo-01@10.128.0.32
```

Quando solicitado, insira a senha: dosecerta

Após a conexão ser estabelecida, você terá acesso ao Raspberry Pi e poderá executar o sistema conforme descrito nas próximas etapas.

## Execução da CLI

### 1. Acessar o diretório do robô 

Estando em "C:/Users/Seu-Usuário/Caminho-para-pasta/2025-1A-T12-EC05-G01>
 
Entre na pasta principal do projeto:  

```bash
cd src/robo
```

### 2. Instalar as dependências  
Baixe e instale todas as bibliotecas necessárias:  

```bash
pip install -r requirements.txt
```

### 3. Executar a CLI  
Por fim, para executar a CLI, use o comando:  

```bash
python3 -m CLI.CLI
```

## Acesso à aplicação web desenvolvida:

### 1. Acessar o diretório software

Estando em "C:/Users/Seu-Usuário/Caminho-para-pasta/2025-1A-T12-EC05-G01>
 
Entre na pasta software:  

```bash
cd src/software
```

### 2. Instalar as dependências  
Baixe e instale todas as bibliotecas necessárias:  

```bash
pip install -r requirements.txt
```

Além disso, acesse o diretório frontend:

```bash
cd frontend
```

E instale as dependências restantes com:

```bash
cd npm install
```


### 3. Execute o backend

Crie um novo terminal e acesse:

```bash
cd src/software/app
```

Após isso, execute o seguinte comando: 

```bash
python3 main.py
```

### 4. Execute o frontend

Estando no diretório ```/frontend```, execute: 

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

Assim, acesse o link disponibilizado ao lado de "Local:"

### 5. Execução do banco de dados

#### 5.1 Crie um novo terminal e acesse o diretório src

Estando em "C:/Users/Seu-Usuário/Caminho-para-pasta/2025-1A-T12-EC05-G01>
 
Entre na pasta principal do projeto:  

```bash
cd src
```

#### 5.2 Executar o banco de dados

Para inicializar o banco de dados, basta executar o seguinte comando

```bash
python3 -m database.database
```

### 6. Execução do app_dobot

Por fim, é necessário a criação de um último terminal, em que após isso será necessário executar:

```bash
cd src/robo
```

Com o robô conectado, basta executar o seguinte código

```bash
python3 -m app_dobot.app_dobot
```
