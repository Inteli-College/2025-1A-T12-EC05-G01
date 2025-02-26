from models.paciente import Paciente  #  Corrected import
from db_conexao import SessionLocal  #  Use SessionLocal for DB sessions

# Function to add a new patient
def test_insert_paciente():
    db = SessionLocal()  # Corrected: Use SessionLocal to create a session
    try:
        novo_paciente = Paciente(nome="Maria Oliveira", leito="B202", hc="HC67890")
        db.add(novo_paciente)
        db.commit()
        print(f"Paciente {novo_paciente.nome} adicionado com sucesso!")
    except Exception as e:
        db.rollback()
        print(f"Erro ao adicionar paciente: {e}")
    finally:
        db.close()

# Function to fetch all patients
def test_get_pacientes():
    db = SessionLocal()  # Corrected: Use SessionLocal to create a session
    pacientes = db.query(Paciente).all()
    for paciente in pacientes:
        print(paciente)
    db.close()

# Run tests
if __name__ == "__main__":
    test_insert_paciente()
    test_get_pacientes()
