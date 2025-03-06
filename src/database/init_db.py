import sqlite3
import os

# Define o caminho correto do banco de dados e do schema.sql
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Caminho do diretório atual (database/)
DB_PATH = os.path.join(BASE_DIR, "database.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")

# Conectar ao banco e criar as tabelas
def initialize_database():
    conn = sqlite3.connect(DB_PATH)  # Agora pega o caminho absoluto do banco
    with open(SCHEMA_PATH, "r") as f:
        conn.executescript(f.read())  # Executa o script SQL
    conn.commit()
    conn.close()

if __name__ == "__main__":
    initialize_database()
    print(f"Banco de dados inicializado com sucesso! Arquivo: {DB_PATH}")
