@echo off
setlocal enabledelayedexpansion

:: Diretório raiz do projeto
set "raiz_projeto=%~dp0"
cd /d "%raiz_projeto%"

:: Inicializa as flags
set "executar_CLI=false"
set "executar_WEB=false"

:: Processa as opções passadas
:parse_args
if "%~1"=="" goto :continue
if /i "%~1"=="-c" set "executar_CLI=true" & goto :next_arg
if /i "%~1"=="--cli" set "executar_CLI=true" & goto :next_arg
if /i "%~1"=="-w" set "executar_WEB=true" & goto :next_arg
if /i "%~1"=="--web" set "executar_WEB=true" & goto :next_arg
if /i "%~1"=="-h" goto :show_help
if /i "%~1"=="--help" goto :show_help
echo Opcao desconhecida: %~1
goto :show_help

:next_arg
shift
goto :parse_args

:show_help
echo Uso: %0 [opcoes]
echo Opcoes:
echo   -c, --cli       Inicia somente a CLI do Robo
echo   -w, --web       Inicia somente o Frontend e Backend (aplicacao web e autenticacao)
echo   -h, --help      Exibe essa mensagem de ajuda
exit /b 1

:continue

:: Criar ambiente virtual Python se não existir
if not exist venv (
    echo Criando ambiente virtual Python...
    python -m venv venv
)

:: Ativar ambiente virtual e instalar dependências
call venv\Scripts\activate
cd src
pip install -r requirements.txt
cd ..

if "%executar_CLI%"=="true" (
    :: Inicia somente a CLI do Robô
    echo Iniciando a CLI do Robo...
    start "CLI Robo" cmd /k "call venv\Scripts\activate && cd src\robo && python -m CLI.CLI"
) else if "%executar_WEB%"=="true" (
    :: Inicia somente Frontend e Backend
    echo Iniciando aplicacao web...
    start "Frontend" cmd /k "cd src\software\frontend && npm run dev"
    start "Backend" cmd /k "call venv\Scripts\activate && cd src && python -m software.backend.backend"
) else (
    :: Inicia todas as aplicações
    echo Iniciando todas as aplicacoes...
    start "Frontend" cmd /k "cd src\software\frontend && npm install && npm run dev"
    start "Backend" cmd /k "call venv\Scripts\activate && cd src && python -m software.backend.backend"
    start "App Dobot" cmd /k "call venv\Scripts\activate && cd src\robo && python -m app_dobot.app_dobot"
)

echo Todos os processos foram iniciados com sucesso!
