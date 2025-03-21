@echo off
setlocal

:: ------------------------------
:: CONFIGURAÇÕES
:: ------------------------------

set ROOT_DIR=%~dp0
set VENV_DIR=%ROOT_DIR%venv

:: ------------------------------
:: INTERPRETAÇÃO DE FLAGS
:: ------------------------------

set RUN_CLI=false
set RUN_WEB=false

:parse_args
if "%~1"=="" goto after_flags
if "%~1"=="-c" set RUN_CLI=true
if "%~1"=="--cli" set RUN_CLI=true
if "%~1"=="-w" set RUN_WEB=true
if "%~1"=="--web" set RUN_WEB=true
shift
goto parse_args

:after_flags

:: ------------------------------
:: CRIAÇÃO E ATIVAÇÃO DO VENV
:: ------------------------------

if not exist "%VENV_DIR%" (
    echo Criando ambiente virtual...
    python -m venv venv
)

call "%VENV_DIR%\Scripts\activate"

echo Instalando dependências...
cd /d "%ROOT_DIR%src"
pip install --break-system-packages -r requirements.txt

:: ------------------------------
:: EXECUÇÃO DAS JANELAS
:: ------------------------------

if "%RUN_CLI%"=="true" (
    echo Iniciando somente a CLI do Robô...
    start cmd /k "cd /d %ROOT_DIR%src\robo && call ..\..\venv\Scripts\activate && python -m CLI.CLI"
    goto fim
)

if "%RUN_WEB%"=="true" (
    echo Iniciando somente o Frontend e Backend...
    start cmd /k "cd /d %ROOT_DIR%src\software\frontend && npm install && npm run dev"
    start cmd /k "cd /d %ROOT_DIR% && call venv\Scripts\activate && cd src\software && python app\main.py"
    goto fim
)

:: MODO PADRÃO: Iniciar tudo
echo Iniciando Frontend...
start cmd /k "cd /d %ROOT_DIR%src\software\frontend && npm install && npm run dev"

echo Iniciando Backend...
start cmd /k "cd /d %ROOT_DIR% && call venv\Scripts\activate && cd src\software && python app\main.py"

echo Iniciando Banco de Dados...
start cmd /k "cd /d %ROOT_DIR% && call venv\Scripts\activate && cd src && python -m database.database"

echo Iniciando App Dobot...
start cmd /k "cd /d %ROOT_DIR% && call venv\Scripts\activate && cd src\robo && python -m app_dobot.app_dobot"

:fim
endlocal
