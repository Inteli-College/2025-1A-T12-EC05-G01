#!/bin/bash

# Função de uso do script
usage() {
  echo "Uso: $0 [opções]"
  echo "Opções:"
  echo "  -c, --cli       Inicia somente a CLI do Robô"
  echo "  -w, --web       Inicia somente o Frontend e Backend (aplicação web e autenticação)"
  echo "  -h, --help      Exibe essa mensagem de ajuda"
  exit 1
}

# Inicializa as flags
executar_CLI=false
executar_WEB=false

# Processa as opções passadas
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -c|--cli) executar_CLI=true ;;
    -w|--web) executar_WEB=true ;;
    -h|--help) usage ;;
    *) echo "Opção desconhecida: $1" && usage ;;
  esac
  shift
done

# Mata a sessão antiga, se existir, e cria uma nova sessão
tmux kill-session -t dose_certa 2>/dev/null
tmux new-session -d -s dose_certa -n dummy

# Define o diretório raiz do projeto
raiz_projeto=$(pwd)

python3 -m venv venv
source venv/bin/activate

cd src 
pip install --break-system-packages -r requirements.txt

if [ "$executar_CLI" = true ]; then
  # Se a flag CLI for passada, inicia somente a janela da CLI
  tmux rename-window -t dose_certa:0 'CLI'
  tmux send-keys -t dose_certa:0 "cd ${raiz_projeto} && source venv/bin/activate" C-m
  tmux send-keys -t dose_certa:0 " cd src && cd robo && python3 -m CLI.CLI" C-m

elif [ "$executar_WEB" = true ]; then
  # Se a flag Web for passada, inicia somente as janelas Frontend e Backend

  # Janela 0: Frontend
  tmux rename-window -t dose_certa:0 'Frontend'
  tmux send-keys -t dose_certa:0 "cd ${raiz_projeto}/src/software/frontend && npm run dev" C-m

  # Janela 1: Backend 
  tmux new-window -t dose_certa -n 'Backend'
  tmux send-keys -t dose_certa:1 "cd ${raiz_projeto} && source venv/bin/activate" C-m
  tmux send-keys -t dose_certa:1 "cd ${raiz_projeto}/src/software && python3 app/main.py" C-m

else
  # Sem flags: Inicia todas as janelas padrão: Frontend, Backend e App Dobot

  # Janela 0: Frontend
  tmux rename-window -t dose_certa:0 'Frontend'
  tmux send-keys -t dose_certa:0 "cd ${raiz_projeto}/src/software/frontend && npm install && npm run dev" C-m

  # Janela 1: Backend 
  tmux new-window -t dose_certa -n 'Backend'
  tmux send-keys -t dose_certa:1 "cd ${raiz_projeto} && source venv/bin/activate" C-m
  tmux send-keys -t dose_certa:1 "cd ${raiz_projeto}/src && python3 -m software.backend.backend" C-m

  # Janela 3: App Dobot (com venv)
  tmux new-window -t dose_certa -n 'App Dobot'
  tmux send-keys -t dose_certa:2 "cd ${raiz_projeto} && source ../venv/bin/activate" C-m
  tmux send-keys -t dose_certa:2 " cd src/robo/ && python3 -m app_dobot.app_dobot" C-m
fi

# Remove a janela dummy se ainda existir
tmux kill-window -t dose_certa:dummy 2>/dev/null

# Anexa a sessão na janela 0
tmux attach-session -t dose_certa:0
