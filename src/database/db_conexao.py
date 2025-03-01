import sqlite3

# Função para conectar ao banco de dados
def get_db_connection():
    conn = sqlite3.connect("database/database.db")  # Caminho do arquivo do banco
    conn.row_factory = sqlite3.Row  # Permite acessar os resultados por nome de coluna
    return conn

