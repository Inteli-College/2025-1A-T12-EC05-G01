# Guia de Como Rodar a CLI do Robô

Este breve guia explica como configurar e executar o projeto: Dose Certa localmente, tendo assim acesso à CLI para controle do robô desenvolvido pelo grupo ao longo da sprint 2.  

## **Pré-requisitos**  
Antes de começar, certifique-se de ter os seguintes programas instalados:  
- [Visual Studio Code (VSCode)](https://code.visualstudio.com/)  
- [Python 3](https://www.python.org/downloads/) e [pip](https://pip.pypa.io/en/stable/installation/)  
- [Git](https://git-scm.com/downloads)  

## **Passo a Passo**  

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

### 4. Acessar o diretório do projeto  

Estando em "C:/Users/Seu-Usuário/Caminho-para-pasta/2025-1A-T12-EC05-G01>
 
Entre na pasta principal do projeto:  

```bash
cd src/robo
```

### 5. Instalar as dependências  
Baixe e instale todas as bibliotecas necessárias:  

```bash
pip install -r requirements.txt
```

### 6. Executar o projeto  
Por fim, para rodar o projeto, use o comando:  

```bash
python3 -m CLI.CLI
```
