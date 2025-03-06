from database.db_conexao import get_db_connection

class Paciente:
    @staticmethod
    def adicionar_paciente(nome, leito, hc):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO paciente (nome, leito, hc) VALUES (?, ?, ?)",
            (nome, leito, hc),
        )
        conn.commit()
        conn.close()

    @staticmethod
    def listar_pacientes():
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM paciente")
        pacientes = cursor.fetchall()
        conn.close()
        return pacientes
